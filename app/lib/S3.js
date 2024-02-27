import {
  ListObjectsV2Command,
  GetObjectCommand,
  S3Client as Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const albumBucketName = "dataspan.frontend-home-assignment";

export const S3Client = new Client({
  region: "eu-central-1",

  credentials: fromCognitoIdentityPool({
    clientConfig: { region: "eu-central-1" },
    identityPoolId: "eu-central-1:31ebe2ab-fc9d-4a2c-96a9-9dee9a9db8b9",
  }),
});

export const listObjects = (params) =>
  S3Client.send(
    new ListObjectsV2Command({
      Bucket: albumBucketName,
      MaxKeys: 20,
      ...params,
    })
  );

export const {
  CommonPrefixes: [{ Prefix: topLevelPrefix }],
} = await listObjects({ Delimiter: "/" });

export const getObject = async (Key) => {
  const response = await S3Client.send(
    new GetObjectCommand({
      Bucket: albumBucketName,
      Key,
    })
  );

  return response.Body.transformToString();
};

export const getAlbums = async () => {
  const { CommonPrefixes } = await listObjects({
    Delimiter: "/",
    Prefix: topLevelPrefix,
  });

  return CommonPrefixes.map((el) =>
    el.Prefix.split("/").filter(Boolean).at(-1)
  );
};

export const getClasses = async () => {
  const data = await getObject(`${topLevelPrefix}data.yaml`);
  const parsedData = Object.fromEntries(
    data.split("\n").map((str) => str.split(":"))
  );

  return parsedData.names.match(/\w+\s?\w+/g);
};

export const getImages = async (album, classes = [], polygons = [0, 4]) => {
  const [minPolygons, maxPolygons] = polygons;

  const filterImages = (images) => {
    return images.filter(
      ({ polygons }) =>
        (polygons.length >= minPolygons && polygons.length <= maxPolygons) ||
        !classes?.length ||
        polygons.some(({ type }) => classes?.includes(type))
    );
  };

  if (album === "all") {
    const albums = await getAlbums();
    const images = await Promise.all(albums.map(getImages));
    return filterImages(images.flat());
  }

  const { Contents } = await listObjects({
    Prefix: `${topLevelPrefix}${album}/images`,
  });

  const images = await Promise.all(
    Contents.filter(({ Key }) => Key.endsWith(".jpg")).map(async ({ Key }) => {
      const command = new GetObjectCommand({
        Bucket: albumBucketName,
        Key,
      });

      const name = Key.split("/").at(-1).split("_jpg").at(0);
      const label = Key.replace("/images/", "/labels/").replace(".jpg", ".txt");

      const url = await getSignedUrl(S3Client, command, { expiresIn: 3600 });
      const data = await getObject(label);

      const polygons = data.split("\n").map((str) => {
        const [type, ...stringCoordinates] = str.split(" ");
        const coordinates = stringCoordinates.reduce(
          (result, el, i, arr) =>
            i % 2 ? [...result, [+arr.at(i - 1), +el]] : result,
          []
        );

        return { type, coordinates };
      });
      return { name, url, polygons };
    })
  );

  return filterImages(images);
};
