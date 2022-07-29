import type { NextApiRequest, NextApiResponse } from 'next';

const lunchBag = process.env.accesstoken;
console.log(lunchBag);
export interface AddI {
    amount: number;
    category: string;
    date: string;
    payee: string;
}

export default function add(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);
    fetch('https://dev.lunchmoney.app/v1/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + lunchBag,
        },
        body: JSON.stringify({
            transactions: req.body.transactions,
        }),
    })
        .then((result) => result.json())
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 300;
            res.json({ err });
        });
}
