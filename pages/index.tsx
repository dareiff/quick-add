import Head from 'next/head';
import React, { createRef, useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

const MoneyAdder = styled.div`
    display: flex;
    flex-direction: row;
    flex-flow: row wrap;
    margin: 10px 0 30px 0;
    justify-content: space-between;
    gap: 15px;

    > button {
        display: inline-flex;
        margin: 0 5px 0 0;
        cursor: pointer;
        padding: 13px 20px;
        color: #000;
        background-color: #fff;
        border: 1px solid #404040;
    }
`;

const Gear = styled.div`
    font-size: 22px;
    cursor: pointer;
    justify-self: flex-end;
`;

const CategoryHeaderGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h3 {
        margin: 0;
        display: inline;
    }
`;

const DisplayButton = styled.button`
    padding: 5px 30px;
    margin: 0;
    box-shadow: 3px 3px 0 rgba(74, 225, 94, 1);
    color: #000;
    background-color: #fff;
    border: 1px solid #404040;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    h1 {
        margin: 10px 20px;
    }
`;

const CategoryHolder = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 20px 0;
`;

interface CategoryI {
    selected: boolean;
    dimmed: boolean;
    value?: number;
}
const CategorySelector = styled.div<CategoryI>`
    display: inline-block;
    padding: 8px 12px;
    margin: 5px;
    font-size: 12px;
    cursor: pointer;
    background-color: ${(props: CategoryI) =>
        props.selected ? 'rgba(74, 225, 94, 1.00)' : 'rgba(255, 205, 1, .20)'};
    border-radius: 8px;
    color: ${(props: CategoryI) => (props.dimmed ? '#909090' : '#202020')};
`;

const InputWrapper = styled.div`
    width: 100%;
    border: 1px solid #404040;
    font-size: 22px;
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TheSingleStepper = styled.div`
    width: 40px;
    display: flex;
    flex-direction: column;
`;

const ValueChange = styled.div`
    width: 28px;
    height: 29px;
    color: #404040;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
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
    box-shadow: 3px 3px 0 rgba(74, 225, 94, 1);
    border: none;
    border-radius: 10px;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
    font-style: italic;
`;

const TinyField = styled.input`
    box-shadow: 3px 3px 0 rgba(74, 225, 94, 1);
    border: 4px solid #404040;
    padding: 5px 10px;
    margin: auto 10px;
    display: inline;
    color: #404040;
    font-weight: 600;
    background-color: #fff;
    border-radius: 10px;
`;

const TinyButton = styled.button`
    background-color: #404040;
    color: #fff;
    padding: 5px 10px;
    margin: auto 10px;
    box-shadow: 3px 3px 0 rgba(74, 225, 94, 1);
    border: 3px solid #404040;
    border-radius: 10px;
    display: inline-block;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 700;
    font-style: italic;
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

const SuccessHolder = styled.div`
    display: flex;
    flex-direction: row;
`;

const Footer = styled.div`
    width: 100%;
    border-top: 1px solid #eaeaea;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px 0;
    align-items: center;

    p {
        font-size: 12px;
    }
`;

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
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [accessTokenInState, setAccessToken] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [showQuickButtons, setShowQuickButtons] = useState(false);
    const [cats, setCats] = useState<Array<LunchMoneyCategory> | null>(null);
    const [recentCategories, setRecentCategories] = useState<{
        category: LunchMoneyCategory;
        count: number
    }[]>([]);
    const [showRecent, setShowRecent] = useState(true);  // Show/hide state for recent categories
    const [showMore, setShowMore] = useState(false); // Show/hide rest of categories
    const [error, setError] = useState<string>('');
    const [category, setChosenCategory] = useState<LunchMoneyCategory | null>(
        null,
    );
    const [settings, showSettings] = useState<boolean>(false);
    const [negative, setNegative] = useState<boolean>(true);

    const [noCategoryWarning, setNoCategoryWarning] = useState<boolean>(false);
    const amountRef = createRef<HTMLInputElement>();
    const notesRef = createRef<HTMLInputElement>();
    const accessRef = createRef<HTMLInputElement>();

    const downloadCats = async (at: string) => {
        console.log('are we doing this?');

        await fetch('https://dev.lunchmoney.app/v1/categories', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + at,
            },
            method: 'GET',
        })
            .then((result) => result.json())
            .then((result: any) => {
                console.log('did we get anything?');
                setCats(result.categories);
            })
            .catch(() => {
                setError(
                    'Something went wrong downloading categories. You might check your network connection, or your API key',
                );
                setCats(null);
            });
    };

    useEffect(() => {
        // try to get localstorage
        if (localStorage.getItem('access_token') === null) {
            console.log('We need to ask for their accessToken');
            return;
        } else if (localStorage.getItem('access_token')) {
            setAccessToken(localStorage.getItem('access_token'));
        }

        const storedShowQuickButtons = localStorage.getItem('showQuickButtons');
        if (storedShowQuickButtons) {
            setShowQuickButtons(JSON.parse(storedShowQuickButtons));
        }

        const storedRecent = localStorage.getItem('recentCategories');
        if (storedRecent) {
            setRecentCategories(JSON.parse(storedRecent));
        }
    }, []);

    useEffect(() => {
        // this is what we do AFTER they press the button to add the accesstoken to local state
        if (accessTokenInState.length === 0) {
            return;
        } else if (accessTokenInState.length > 1) {
            setAccessToken(localStorage.getItem('access_token'));
            setAuthenticated(true);
        }
    }, [accessTokenInState]);

    useEffect(() => {
        //this is what we do when the accessToken is in state and
        //we want to download the categories
        if (accessTokenInState.length === 0) {
            return;
        }
        downloadCats(accessTokenInState);
    }, [accessTokenInState]);

    const addAccessTokenFromHTMLElement = async () => {
        if (accessRef.current !== null) {
            setAccessToken(accessRef.current.value);
            setAuthenticated(true);
            localStorage.setItem('access_token', accessRef.current.value);
        }
    };

    useEffect(() => {
        localStorage.setItem(
            'showQuickButtons',
            JSON.stringify(showQuickButtons),
        );

    }, [showQuickButtons]);

    useEffect(() => {
        if (recentCategories.length > 0) {
            localStorage.setItem(
                'recentCategories',
                JSON.stringify(recentCategories),
            );
        }
    }, [recentCategories]);

    useEffect(() => {
        // Focus on the cash entry input when the component mounts and authenticated
        if (authenticated && amountRef.current) {
            amountRef.current.focus();
        }
    }, [authenticated]);

    const updateRecentCategories = (newCategory: LunchMoneyCategory) => {
        let updatedRecent = [...recentCategories];

        const existingCategoryIndex = updatedRecent.findIndex(
            (item) => item.category.id === newCategory.id,
        );

        if (existingCategoryIndex !== -1) {
            // Category exists, increment count and move to the front (most recent)
            updatedRecent[existingCategoryIndex].count++;
            const updatedItem = updatedRecent.splice(existingCategoryIndex, 1)[0]; // Remove and get the item
            updatedRecent.unshift(updatedItem); // Add to the beginning

        } else {
            if (updatedRecent.length >= 5) {
                // Sort by count descending
                updatedRecent.sort((a, b) => b.count - a.count);
                updatedRecent.pop(); // Remove the least used/oldest
            }
            // New category, add it to the beginning with count 1
            updatedRecent.unshift({ category: newCategory, count: 1 }); // Add to beginning

        }
        setRecentCategories(updatedRecent);
    };

    const insertTransaction = async () => {
        setLoading(true);

        if (amount === 0 || category === null) {
            setLoading(false);
            setNoCategoryWarning(true);
            return;
        } else {
            var now = dayjs();
            await fetch('https://dev.lunchmoney.app/v1/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessTokenInState,
                },
                body: JSON.stringify({
                    debit_as_negative: true,
                    transactions: [
                        {
                            amount: negative ? `-${amount}` : amount,
                            category_id: category.id,
                            date: now.format('YYYY-MM-DD').toString(),
                            payee: 'CASH',
                            notes: notes,
                        },
                    ],
                }),
            })
                .then((result) => result.json())
                .then((res) => {
                    console.log(res);
                    if (category) { // Check if category is selected
                        console.log('Updating recent categories:', category);
                        updateRecentCategories(category);
                    }
                    setLoading(false);
                    setAmount(0);
                    setSuccess(true);
                    // Clear notes after successful submission
                    setNotes('');
                    setChosenCategory(null);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setError('error when inserting transaction');
                });
        }
    };

    return (
        <AppContainer>
            <Head>
                <title>Milk Money</title>
            </Head>

            <MainContainer>
                <HeaderContainer>
                    <span>&nbsp;</span>
                    <h1>Milk Money</h1>
                    <Gear onClick={() => showSettings(!settings)}>⚙️</Gear>
                </HeaderContainer>

                {(!authenticated || settings) && (
                    <div style={{ width: '100%', margin: '20px 0' }}>
                        <h2>Settings:</h2>
                        <p>Use your own access token to get started.</p>
                        {accessTokenInState.length === 0 ? (
                            <div>
                                <TinyField
                                    placeholder='accesstoken'
                                    type='text'
                                    ref={accessRef}
                                />
                                <TinyButton
                                    onClick={() =>
                                        addAccessTokenFromHTMLElement()
                                    }
                                >
                                    Add
                                </TinyButton>
                            </div>
                        ) : (
                            <div>
                                <span>
                                    {accessTokenInState.substring(0, 10)}...
                                </span>
                                <TinyButton
                                    onClick={() => {
                                        localStorage.removeItem('access_token');
                                        setAccessToken('');
                                        setAuthenticated(false);
                                    }}
                                >
                                    Delete
                                </TinyButton>
                            </div>
                        )}
                        <div>  {/* New toggle for quick buttons */}
                            <label htmlFor="showQuickButtons">Show Quick Buttons:</label>
                            <input
                                type="checkbox"
                                id="showQuickButtons"
                                checked={showQuickButtons}
                                onChange={(e) => setShowQuickButtons(e.target.checked)}
                            />
                        </div>
                        {recentCategories.length !== 0 && (
                            <div>
                                <TinyButton
                                    onClick={() => {
                                        localStorage.removeItem('recentCategories');
                                        setRecentCategories([]);
                                    }}
                                >
                                    Clear recent categories
                                </TinyButton>
                            </div>
                        )}
                    </div>
                )}
                {authenticated && !settings && (
                    <div>
                        {error.length > 0 &&
                            accessTokenInState.length !== 0 && <p>{error}</p>}
                        <label htmlFor='lineItem'>Cash Entry:</label>
                        <InputWrapper>
                            <TheSingleStepper>
                                <ValueChange
                                    onClick={() => setNegative(false)}
                                    style={{
                                        marginRight: '10px',
                                        backgroundColor: negative
                                            ? 'white'
                                            : 'rgb(79, 235, 79)',
                                    }}
                                >
                                    +
                                </ValueChange>
                                <ValueChange
                                    onClick={() => setNegative(true)}
                                    style={{
                                        marginRight: '10px',
                                        backgroundColor: negative
                                            ? 'rgb(255, 144, 144)'
                                            : 'white',
                                    }}
                                >
                                    -
                                </ValueChange>
                            </TheSingleStepper>
                            <DollarSign>$</DollarSign>
                            <NumberInput
                                id='lineItem'
                                ref={amountRef}
                                value={amount.toString()}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>,
                                ) =>
                                    setAmount(parseFloat(e.currentTarget.value))
                                }
                                type="number" //  Add the type="number" attribute
                                inputMode="numeric" // Add inputMode="numeric" (for older browsers)
                            />
                        </InputWrapper>
                        {showQuickButtons && ( // Conditionally render Quick Buttons
                            <>
                            <h3>Quick buttons:</h3>
                            <MoneyAdder>
                                <button onClick={() => setAmount(0)}>Clear</button>
                                <button onClick={() => setAmount(amount + 1)}>
                                    $1
                                </button>
                                <button onClick={() => setAmount(amount + 2)}>
                                    $2
                                </button>
                                <button onClick={() => setAmount(amount + 5)}>
                                    $5
                                </button>
                                <button onClick={() => setAmount(amount + 10)}>
                                    $10
                                </button>
                                <button onClick={() => setAmount(amount + 20)}>
                                    $20
                                </button>
                                <button onClick={() => setAmount(amount + 100)}>
                                    $100
                                </button>
                            </MoneyAdder>
                            </>
                        )}
                        <CategoryHeaderGroup>
                            <h3>Category</h3>
                            {recentCategories.length !== 0 && (
                                <DisplayButton onClick={() => setShowMore(!showMore)}>
                                    {showMore ? 'Hide Categories' : 'Show All Categories'}
                                </DisplayButton>
                            )}
                        </CategoryHeaderGroup>
                        {cats !== null && (
                            <>
                                <CategoryHolder>
                                    {recentCategories.map((catone, i) => (
                                        <CategorySelector
                                            key={i}
                                            value={catone.category.id}
                                            selected={
                                                category !== null &&
                                                category.id === catone.category.id
                                            }
                                            dimmed={
                                                category !== null &&
                                                category.id !== catone.category.id &&
                                                category !== null
                                            }
                                            onClick={() => {
                                                setChosenCategory(catone.category);
                                                updateRecentCategories(catone.category);
                                                setShowMore(false);
                                            }}
                                        >
                                            {catone.category.name}
                                        </CategorySelector>
                                    ))}
                                </CategoryHolder>
                                {(showMore || recentCategories.length === 0) && (
                                    <CategoryHolder>
                                        {cats
                                            .filter(cat => !cat.is_group) // Filter out group categories
                                            .filter((cat) => !recentCategories.some(recent => recent.category.id === cat.id)) // Exclude recent categories
                                            .map((catone, i) => (
                                                <CategorySelector
                                                    key={i}
                                                    value={catone.id}
                                                    selected={
                                                        category !== null &&
                                                        category.id === catone.id
                                                    }
                                                    dimmed={
                                                        category !== null &&
                                                        category.id !== catone.id &&
                                                        category !== null
                                                    }
                                                    onClick={() => {
                                                        setChosenCategory(catone);
                                                        updateRecentCategories(catone);
                                                        setShowMore(false);
                                                    }}
                                                >
                                                    {catone.name}
                                                </CategorySelector>
                                            ))}
                                    </CategoryHolder>
                                )}
                            </>
                        )}
                        <label htmlFor='notes'>Notes:</label>
                        <InputWrapper>
                            <NumberInput
                                id='notes'
                                ref={notesRef}
                                value={notes}
                                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                    setNotes(e.currentTarget.value)
                                }
                            />
                        </InputWrapper>
                        <Button onClick={() => insertTransaction()}>
                            Add Transaction
                        </Button>
                        {success && (
                            <SuccessHolder>
                                <p>Succesfully added transaction!</p>
                                <TinyButton onClick={() => setSuccess(false)}>
                                    Clear
                                </TinyButton>
                            </SuccessHolder>
                        )}
                    </div>
                )}
            </MainContainer>

            <Footer>
                <a
                    href='https://fun-club.xyz'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    a fun club project
                </a>
                <p>
                    A really basic app that sends a cash transaction (probably)
                    to{' '}
                    <a href='https://lunchmoney.app/?refer=eg3r4y7t'>
                        Lunch Money
                    </a>
                    . It’s all stored right on your phone once you add your api
                    key, and it “just works.”
                </p>
            </Footer>
        </AppContainer>
    );
};

export default Home;

