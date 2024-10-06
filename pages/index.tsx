import Head from 'next/head';
import React, { createRef, useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import Select from 'react-select';

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

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    h1 {
        margin: 5px 20px;
        font-size: 30px;
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
    padding: 12px 12px;
    margin: 5px;
    font-size: 17px;
    cursor: pointer;
    background-color: ${(props: CategoryI) =>
        props.selected ? '#006bb3' : '#e6e6e6'};
    border-radius: 8px;
    color: ${(props: CategoryI) => (props.dimmed ? 'black' : 'white')};
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
    height: 100px;
`;

const TheSingleStepper = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
`;

const ValueChange = styled.div`
    width: 110px;
    height: 25px;
    color: #404040;
    text-align: center;
    border-radius: 8px;
    font-size: 17px;
    padding: 3px 3px;
    align-items: center;
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
    background-color: #006bb3;
    color: #fff;
    padding: 10px 30px;
    margin: 20px auto;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-weight: 700;
`;

const TinyField = styled.input`
    padding: 12px 12px;
    margin: auto;
    display: inline;
    color: #404040;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid #404040;
    width: 100%;
`;

const TinyButton = styled.button`
    width: 100%;
    background-color: #006bb3;
    color: #fff;
    padding: 10px 30px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
`;

const NumberInput = styled.input`
    font-size: 24px;
    border: none;
    width: 50%;
    margin: 0 0 0 10px;
    display: inline-block;

    &:focus {
        outline: none;
    }
`;

const DollarSign = styled.span`
    font-size: 22px;
    margin: 0 0 0 30px;
`;

const SuccessHolder = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    p {
        font-size: 17px;
    }
`;

const WarningHolder = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 17px;
    color: red;
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
    archived: boolean;
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
    const [recentCount, setRecentCount] = useState<number>(3);
    const [showRecent, setShowRecent] = useState(true);
    const [category, setCategory] = useState<LunchMoneyCategory | null>(null);
    const [error, setError] = useState<string>('');
    const [settings, showSettings] = useState<boolean>(false);
    const [negative, setNegative] = useState<boolean>(true);

    const [noCategoryWarning, setNoCategoryWarning] = useState<boolean>(false);
    const [noAmountWarning, setNoAmountWarning] = useState<boolean>(false);
    const amountRef = createRef<HTMLInputElement>();
    const notesRef = createRef<HTMLInputElement>();
    const accessRef = createRef<HTMLInputElement>();
    const recentCountRef = createRef<HTMLInputElement>();

    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const categoryOptions = cats?.filter(cat => !cat.is_group)
                                 .filter(cat => !cat.archived)
                                 .filter(cat => !cat.exclude_from_budget)
                                 .filter(cat => !cat.exclude_from_totals)
                                 // Transform categories into options for react-select
                                 .map((cat) => ({
                                     value: cat,
                                     label: cat.name,
                                 })) || [];

    const handleCategoryChange = (selectedOption: any) => {
        setSelectedCategory(selectedOption);
        setChosenCategory(selectedOption.value);
        updateRecentCategories(selectedOption.value);
    };

    const setChosenCategory = (newCategory: LunchMoneyCategory) => {
        setCategory(newCategory);

        // Set focus to the notes input after setting the category.
        if (notesRef.current) {
            notesRef.current.focus();
        }
    };

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

        const storedRecentCount = localStorage.getItem('recentCount');
        if (storedRecentCount) {
            setRecentCount(parseInt(storedRecentCount, 10));
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
            showSettings(false);
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
        localStorage.setItem('recentCount', recentCount.toString());
    }, [recentCategories, recentCount]);

    const updateRecentCategories = (newCategory: LunchMoneyCategory) => {
        let updatedRecent = [...recentCategories];

        const existingCategoryIndex = updatedRecent.findIndex(
            (item) => item.category.id === newCategory.id,
        );

        if (existingCategoryIndex !== -1) {
            // Category exists, increment count but don't move.
            updatedRecent[existingCategoryIndex].count++;
       } else {
            if (updatedRecent.length >= recentCount) {
                // Sort by count descending
                updatedRecent.sort((a, b) => b.count - a.count);
                updatedRecent.pop(); // Remove the least used/oldest
            }
            // New category, add it to the beginning with count 1
            updatedRecent.unshift({ category: newCategory, count: 1 }); // Add to beginning

        }
        setRecentCategories(updatedRecent);
        setNoCategoryWarning(false);
    };

    const handleRecentCountChange = () => {
        if (recentCountRef.current) {
            const newCount = parseInt(recentCountRef.current.value, 10);
            if (!isNaN(newCount) && newCount > 0) { // Validate input
                setRecentCount(newCount);
                // Re-apply limit to recentCategories based on new count:
                setRecentCategories(prevRecent => prevRecent.slice(0, newCount));
            }
        }
    }

    const handleNotesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {  // Check if Enter key is pressed
            e.preventDefault();  // Prevent default form submission behavior (important!)
            insertTransaction(); // Call your transaction function
        }
    };

    const insertTransaction = async () => {
        setLoading(true);
        let timeoutId: ReturnType<typeof setTimeout>;

        if (category === null) {
            setNoCategoryWarning(true);
        }
        if (amount === 0) {
            setNoAmountWarning(true);
        }

        if (amount === 0 || category === null) {
            setLoading(false);
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
                        updateRecentCategories(category);
                    }
                    setLoading(false);
                    setAmount(0);
                    setSuccess(true);
                    setNotes('');
                    setChosenCategory(null);
                    setSelectedCategory(null);
                    setCategory(null);
                    timeoutId = setTimeout(() => {
                        setSuccess(false);
                    }, 3000);

                    return timeoutId; //return the timeout ID
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setError('error when inserting transaction');
                    clearTimeout(timeoutId)
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

                        {accessTokenInState.length === 0 ? (
                            <div>
                                <h3>Welcome!</h3>
                                <p>This app lets you quickly add manual transactions to LunchMoney on the go.</p>
                                <p>To get started, add your access token (only stored locally on your device.)</p>
                                <TinyField
                                    placeholder='LunchMoney Access Token'
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
                                <h3>Settings:</h3>
                                <div>
                                    <TinyButton
                                        onClick={() => {
                                            localStorage.removeItem('access_token');
                                            setAccessToken('');
                                            setAuthenticated(false);
                                        }}
                                    >
                                        Delete Access Token (...{accessTokenInState.slice(-6)})
                                    </TinyButton>
                                </div>
                                <div>  {/* New toggle for quick buttons */}
                                    <p></p><TinyButton onClick={() => {
                                        setShowQuickButtons(!showQuickButtons);
                                        showSettings(false);
                                    }}>
                                        {showQuickButtons ? 'Hide Quick Buttons' : 'Show Quick Buttons'}
                                    </TinyButton>
                                </div>
                                {recentCategories.length !== 0 && (
                                    <div>
                                        <p></p><TinyButton
                                            onClick={() => {
                                                localStorage.removeItem('recentCategories');
                                                setRecentCategories([]);
                                                showSettings(false);
                                            }}
                                        >
                                            Clear recent categories
                                        </TinyButton>
                                    </div>
                                )}
                                <div>
                                    <p></p><label htmlFor="recentCount">Number of recent categories to show:</label>
                                    <TinyField
                                        id="recentCount"
                                        type="number"
                                        ref={recentCountRef}
                                        value={recentCount}
                                        onChange={handleRecentCountChange}
                                        min="1"  // Prevent negative or zero values
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {authenticated && !settings && (
                    <div>
                        {error.length > 0 &&
                            accessTokenInState.length !== 0 && <p>{error}</p>}
                        <p></p>
                        <InputWrapper>
                            <DollarSign>$</DollarSign>
                            <NumberInput
                                id='lineItem'
                                ref={amountRef}
                                value={amount.toString()}
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>,
                                ) =>
                                    {
                                        setAmount(parseFloat(e.currentTarget.value))
                                        setNoAmountWarning(false);
                                    }
                                }
                                type="number" //  Add the type="number" attribute
                                inputMode="numeric" // Add inputMode="numeric" (for older browsers)
                            />
                            <TheSingleStepper>
                                <ValueChange
                                    onClick={() => setNegative(false)}
                                    style={{
                                        marginRight: '20px',
                                        color: !negative ? 'white' : 'black',
                                        backgroundColor: negative
                                            ? 'white'
                                            : '#006bb3',
                                    }}
                                >
                                    Income
                                </ValueChange>
                                <ValueChange
                                    onClick={() => setNegative(true)}
                                    style={{
                                        marginRight: '20px',
                                        color: negative ? 'white' : 'black',
                                        backgroundColor: negative
                                            ? '#006bb3'
                                            : 'white',
                                    }}
                                >
                                    Expense
                                </ValueChange>
                            </TheSingleStepper>
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
                                                category === null || (category !== null &&
                                                category.id !== catone.category.id)
                                            }
                                            onClick={() => {
                                                setChosenCategory(catone.category);
                                                updateRecentCategories(catone.category);
                                            }}
                                        >
                                            {catone.category.name}
                                        </CategorySelector>
                                    ))}
                                </CategoryHolder>

                                <Select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    options={categoryOptions}
                                    isSearchable={false}
                                    placeholder={recentCategories.length === 0 ? 'Select a category...' : 'More categories...'}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '6px 6px',
                                            margin: 'auto',
                                            color: '#404040',
                                            fontSize: '20px',
                                            backgroundColor: '#fff',
                                            borderRadius: '5px',
                                            border: '1px solid #404040',
                                            width: '100%',
                                        }),
                                    }}
                                />
                            </>
                        )}

                        <p></p>
                            <TinyField
                                id='notes'
                                placeholder='(Optional) Add note'
                                ref={notesRef}
                                value={notes}
                                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                    setNotes(e.currentTarget.value)
                                }
                                onKeyDown={handleNotesKeyDown}
                                type="text"
                            />
                        <Button onClick={() => insertTransaction()}>
                            Add Transaction
                        </Button>
                        {success && (
                            <SuccessHolder>
                                <p>Successfully added 🥳!</p>
                            </SuccessHolder>
                        )}
                        {noAmountWarning && (
                            <WarningHolder>
                                Please enter an amount.
                            </WarningHolder>
                        )}
                        {noCategoryWarning && (
                            <WarningHolder>
                                Please select a category.
                            </WarningHolder>
                        )}
                    </div>
                )}
            </MainContainer>
            {(!authenticated || settings) && (
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
            )}
        </AppContainer>
    );
};

export default Home;

