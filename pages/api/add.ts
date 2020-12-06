import type { NextApiRequest, NextApiResponse } from 'next';

const lunchBag = process.env.accesstoken;
console.log(lunchBag);
export interface AddI {
    amount: number;
    category: string;
    payee: string;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    fetch('https://dev.lunchmoney.app/v1/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + lunchBag,
        },
        body: JSON.stringify({
            transactions: [
                req.body.transactions.map((transaction: AddI) => {
                    return transaction;
                }),
            ],
        }),
    })
        .then(result => {
            if (result.status === 401) {
                res.statusCode = 401;
                res.json({ result });
            }
            console.log(result);
            res.statusCode = 200;
            res.json({ success: true });
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 300;
            res.json({ err });
        });
};
