import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await fetch('https://dev.lunchmoney.app/v1/categories', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + req.body.accessToken,
    },
  })
    .then((result) => {
      if (result.status === 401) {
        res.statusCode = 401;
        res.json({ result });
      }
      return result.json();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 300;
      res.json({ err });
    });
};
