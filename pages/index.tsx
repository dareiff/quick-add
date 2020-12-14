import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { createRef, useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

const Footer = styled.div`
    width: 100%;
    border-top: 1px solid #eaeaea;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    align-items: center;

    img {
        margin-left: 0.5rem;
    }
    a {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const FavSelector = styled.span`
    text-align: left;
    width: 100%;
    font-size: 18px;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    background-color: ${props => (props.odd ? '#fafafa' : '#fff')};
`;

const InputWrapper = styled.div`
    width: 100%;
    text-align: left;
    border: 2px solid #404040;
    font-size: 22px;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TheSingleStepper = styled.div`
    width: 40px;
    display: flex;
    flex-direction: column;

    > div {
        width: 100%;
        height: 50%;
        background-color: #303030;
        color: #fff;
        text-align: center;
    }
`;

const AppContainer = styled.div`
    min-height: 100vh;
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const MainContainer = styled.div`
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 400px;

    label {
        text-align: left;
        margin: 10px 0;
        font-weight: 600;
        width: 100%;
    }
`;

const Button = styled.button`
    width: 100%;
    background-color: #404040;
    color: #fff;
    padding: 10px 30px;
    margin: 20px auto;
`;

const NumberInput = styled.input`
    font-size: 20px;
    border: none;
    width: 90%;
    margin: 0 0 0 10px;
    display: inline-block;

    &:focus {
        outline: none;
    }
`;

const DollarSign = styled.span`
    font-size: 22px;
`;

const Bubble = styled.span`
    background-color: ${props => (!props.selected ? '#eaeaea' : '#f79677')};
    padding: 8px 15px;
    border-radius: 18px;
    margin: 5px;
`;

const BubbleHolder = styled.div`
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const reducer = (state, action) => {
    if (state.categories.filter(cat => cat.id === action.value.id).length > 0) {
        const filterCats = state.categories.filter(
            currentFavorite => currentFavorite.id !== action.value.id
        );
        return { categories: filterCats };
    } else {
        return {
            categories: [
                { id: action.value.id, name: action.value.name },
                ...state.categories,
            ],
        };
    }
};

interface LunchMoneyCategory {
    id: number;
    name: string;
    description: null;
    is_income: boolean;
    exclude_from_budget: boolean;
    exclude_from_totals: boolean;
    updated_at: string;
    created_at: string;
    is_group: boolean;
    group_id: null | number;
}

const Home: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [favs, setFavs] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [cats, setCats] = useState<Array<LunchMoneyCategory>>(null);
    const [error, setError] = useState<string>('');
    const [categoryID, setCategoryID] = useState<number | null>(null);

    const amountRef = createRef<HTMLInputElement>();

    const favoriteCategories = { categories: [] };

    const [favCats, dispatch] = useReducer(reducer, favoriteCategories);

    const downloadCats = async () => {
        await fetch('/api/getCat')
            .then(result => result.json())
            .then((result: any) => {
                setCats(result.categories);
            })
            .catch(err => {
                setError(
                    'Something went wrong downloading categories. You might check your network connection, or your API key'
                );
                setCats(null);
            });
    };

    useEffect(() => {
        downloadCats();
        amountRef.current.focus();
    }, []);

    const insertTransaction = async () => {
        setLoading(true);
        if (amount === 0 || categoryID === null) {
            setLoading(false);
            return;
        } else {
            var now = dayjs();
            await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transactions: [
                        {
                            amount: amount,
                            category_id: categoryID,
                            date: now.format('YYYY-MM-DD').toString(),
                            payee: 'CASH',
                        },
                    ],
                }),
            })
                .then(res => {
                    console.log(res);
                    setLoading(false);
                    setAmount(0);
                    setSuccess(true);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    return (
        <AppContainer>
            <Head>
                <title>Coin Purse</title>
            </Head>

            <MainContainer>
                <h1>Coin Purse</h1>
                {success && <span>we good</span>}
                {cats === null && <span>Loading...</span>}
                {error.length > 0 && <span>{error}</span>}
                <label htmlFor='lineItem'>Cash Entry:</label>
                <InputWrapper>
                    <TheSingleStepper>
                        <div>+</div>
                        <div>-</div>
                    </TheSingleStepper>
                    <DollarSign>$</DollarSign>
                    <NumberInput
                        id='lineItem'
                        type='number'
                        ref={amountRef}
                        pattern='\d*'
                        onChange={e => setAmount(parseInt(e.target.value))}
                    />
                </InputWrapper>
                {favCats.categories.length > 0 && (
                    <BubbleHolder>
                        {favCats.categories.map(cat => {
                            return (
                                <Bubble
                                    selected={categoryID === cat.id}
                                    key={cat.id}
                                    onClick={() => setCategoryID(cat.id)}
                                >
                                    {cat.name}
                                </Bubble>
                            );
                        })}
                    </BubbleHolder>
                )}
                <label htmlFor='categorySelect'>
                    <span>Category:</span>{' '}
                    <span
                        style={{
                            fontWeight: 400,
                            fontSize: '12px',
                            marginLeft: 'auto',
                        }}
                        onClick={() => setFavs(!favs)}
                    >
                        Set Favs
                    </span>
                </label>
                {favs &&
                    cats !== null &&
                    cats.map((category, i) => (
                        <FavSelector key={i} odd={i & 1 && true}>
                            <label
                                style={{
                                    width: '200px',
                                }}
                                htmlFor='categorySelect'
                            >
                                {category.name}
                            </label>
                            <input
                                type='checkbox'
                                style={{ width: '18px', height: '20px' }}
                                onChange={() =>
                                    dispatch({
                                        value: {
                                            id: category.id,
                                            name: category.name,
                                        },
                                    })
                                }
                            ></input>
                        </FavSelector>
                    ))}
                <select
                    onChange={e => setCategoryID(parseInt(e.target.value))}
                    id='categorySelect'
                >
                    {cats !== null ? (
                        cats.map((category, i) => (
                            <option key={i} value={category.id}>
                                {category.name}
                            </option>
                        ))
                    ) : (
                        <option>Loading</option>
                    )}
                </select>
                <Button onClick={() => insertTransaction()}>Add</Button>
            </MainContainer>

            <Footer>
                <a
                    href='https://derekr.net'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    team fun
                </a>
            </Footer>
        </AppContainer>
    );
};

export default Home;
