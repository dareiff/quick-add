import React, { createRef, useEffect, useState, useRef, KeyboardEventHandler } from 'react';
import Head from 'next/head';
import dayjs from 'dayjs';
import Select from 'react-select';
import Switch from "react-switch";
import { StylesConfig } from 'react-select';

import {
    MoneyAdder,
    Gear,
    HeaderContainer,
    ItemHolder,
    ItemSelector,
    InputWrapper,
    TheSingleStepper,
    ValueChange,
    AppContainer,
    MainContainer,
    Button,
    TinyField,
    NumberInput,
    DollarSign,
    SuccessHolder,
    WarningHolder,
    Footer,
} from '../styles/styledComponents';

import Settings from '../components/Settings';

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

interface LunchMoneyAsset {
    id: number;
    type_name: string;
    subtype_name: string | null;
    display_name: string;
    balance: string;
    balance_as_of: string;
    currency: string;
    institution_name: string | null;
    exclude_transactions: boolean;
    created_at: string;
}

interface Option<T> {
    readonly label: string;
    readonly value: T;
}

const createOption = (label: string): Option<string> => ({
    label,
    value: label,
});

const Home: React.FC = () => {
    const menuStyles: StylesConfig<any, false> = {
        control: (provided, state) => ({
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
    };

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

    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<readonly Option<string>[]>([]);
    const [showTooltip, setShowTooltip] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [assets, setAssets] = useState<Array<LunchMoneyAsset> | null>(null);
    const [chosenAsset, setChosenAsset] = useState<LunchMoneyAsset | null>(null);
    const [recentAssets, setRecentAssets] = useState<{
        asset: LunchMoneyAsset;
        count: number
    }[]>([]);
    const [transactionCleared, setTransactionCleared] = useState<boolean>(false);

    useEffect(() => {
        // Retrieve the transactionCleared state from localStorage
        const storedTransactionCleared = localStorage.getItem('transactionCleared');
        if (storedTransactionCleared) {
            setTransactionCleared(JSON.parse(storedTransactionCleared));
        }
    }, []);

    useEffect(() => {
        // Save the transactionCleared state to localStorage whenever it changes
        localStorage.setItem('transactionCleared', JSON.stringify(transactionCleared));
    }, [transactionCleared]);

    const categoryOptions = cats?.filter(cat => !cat.is_group)
                                 .filter(cat => !cat.archived)
                                 .filter(cat => !cat.exclude_from_budget)
                                 .filter(cat => !cat.exclude_from_totals)
                                 // Transform categories into options for react-select
                                 .map((cat) => ({
                                     value: cat,
                                     label: cat.name,
                                 })) || [];

    const assetOptions: Option<LunchMoneyAsset>[] = assets?.map((asset) => ({
        value: asset,
        label: asset.display_name,
    })) || [];

    const handleCategoryChange = (selectedOption: Option<LunchMoneyCategory> | null) => {
        if (selectedOption) {
            setSelectedCategory(selectedOption);
            setChosenCategory(selectedOption.value);
            updateRecentCategories(selectedOption.value);
            setNoCategoryWarning(false);
        }
    };

    const handleAssetChange = (selectedOption: Option<LunchMoneyAsset> | null) => {
        if (selectedOption) {
            setChosenAsset(selectedOption.value);
            updateRecentAssets(selectedOption.value);
            if (amountRef.current) {
                amountRef.current.focus();
            }
        }
    };

    const setChosenCategory = (newCategory: LunchMoneyCategory) => {
        setCategory(newCategory);
    };

    const downloadCats = async (at: string) => {
        console.log('are we doing this?');

        const result = await fetch('https://dev.lunchmoney.app/v1/categories', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + at,
            },
            method: 'GET',
        });

        if (!result.ok) { // Check for non-2xx status codes
            const error = 'Something went wrong downloading categories. You might check your network connection, or your API key';
            console.error(error);
            setError(error);
            setCats(null);
            return;
        }

        const data = await result.json();
        console.log('did we get anything?');
        setCats(data.categories);
        setError('');
    };

    const downloadAssets = async (at: string) => {
        const result = await fetch('https://dev.lunchmoney.app/v1/assets', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + at,
            },
            method: 'GET',
        });

        if (!result.ok) {
            const error = 'Something went wrong downloading assets. You might check your network connection, or your API key';
            console.error(error);
            setError(error);
            setAssets(null);
            return;
        }

        const data = await result.json();
        setAssets(data.assets);
        setError('');
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (!inputValue) return;

        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newTag = createOption(inputValue);
                // Check if the tag already exists (case-insensitive)
                const tagExists = tags.some(
                    (tag) => tag.value.toLowerCase() === newTag.value.toLowerCase()
                );

                if (!tagExists) { // Only add if it doesn't exist
                    setTags((prev) => [...prev, newTag]);
                }

                setInputValue('');
                event.preventDefault();
        }
    };

    const handleBlur = () => {
        if (inputValue) { // Only if there's a value
            const newTag = createOption(inputValue);
            const tagExists = tags.some(
                (tag) => tag.value.toLowerCase() === newTag.value.toLowerCase()
            );

            if (!tagExists) {
                setTags((prev) => [...prev, newTag]);
            }
            setInputValue(''); // Clear the input
        }
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

        const storedTags = localStorage.getItem('tags');
        if (storedTags) {
            setTags(JSON.parse(storedTags));
        }

        const storedRecentAssets = localStorage.getItem('recentAssets');
        if (storedRecentAssets) {
            setRecentAssets(JSON.parse(storedRecentAssets));
        }

    }, []);

    useEffect(() => {
        // this is what we do AFTER they press the button to add the accesstoken to local state
        if (accessTokenInState === null || accessTokenInState.length === 0) {
            return;
        } else if (accessTokenInState.length > 1) {
            setAccessToken(localStorage.getItem('access_token'));
            setAuthenticated(true);
        }
    }, [accessTokenInState]);

    useEffect(() => {
        //this is what we do when the accessToken is in state and
        //we want to download the categories
        if (accessTokenInState === null || accessTokenInState.length === 0) {
            return;
        }
        downloadCats(accessTokenInState);
        downloadAssets(accessTokenInState);
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
        localStorage.setItem('tags', JSON.stringify(tags));
    }, [tags]);

    useEffect(() => {
        localStorage.setItem('recentCount', recentCount.toString());
    }, [recentCount]);

    useEffect(() => {
        localStorage.setItem('recentAssets', JSON.stringify(recentAssets));
    }, [recentAssets]);

    const updateRecentCategories = (newCategory: LunchMoneyCategory) => {
        let updatedRecent = [...recentCategories];
        const existingCategoryIndex = updatedRecent.findIndex(item => item.category.id === newCategory.id);

        if (existingCategoryIndex !== -1) {
            updatedRecent[existingCategoryIndex].count++;
        } else {
            updatedRecent.unshift({ category: newCategory, count: 1 });
        }

        // Sort and slice BEFORE updating state
        updatedRecent.sort((a, b) => b.count - a.count);
        updatedRecent = updatedRecent.slice(0, recentCount);

        // Update state and local storage ONLY if there's a change
        if (JSON.stringify(updatedRecent) !== JSON.stringify(recentCategories)) {
            setRecentCategories(updatedRecent);  // Update state first
            localStorage.setItem('recentCategories', JSON.stringify(updatedRecent));
        }
    };

    const updateRecentAssets = (newAsset: LunchMoneyAsset) => {
        let updatedRecent = [...recentAssets];
        const existingAssetIndex = updatedRecent.findIndex(item => item.asset.id === newAsset.id);

        if (existingAssetIndex !== -1) {
            updatedRecent[existingAssetIndex].count++;
        } else {
            updatedRecent.unshift({ asset: newAsset, count: 1 });
        }

        updatedRecent.sort((a, b) => b.count - a.count);

        if (JSON.stringify(updatedRecent) !== JSON.stringify(recentAssets)) {
            setRecentAssets(updatedRecent);
            localStorage.setItem('recentAssets', JSON.stringify(updatedRecent));
        }
    };

    const handleRecentCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        setRecentCount(value);
    };

    const handleNotesKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {  // Check if Enter key is pressed
            e.preventDefault();  // Prevent default form submission behavior (important!)
            insertTransaction(); // Call your transaction function
        }
    };

    const handleTransactionClearedChange = (checked: boolean) => {
        setTransactionCleared(checked);
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
        }

        var now = dayjs();
        const date = now.format('YYYY-MM-DD').toString();
        const payee = 'CASH';
        const tagValues = tags.map((tag) => tag.value);

        const transactionsToInsert = [{
            amount: negative ? `-${amount}` : amount,
            category_id: category.id,
            asset_id: chosenAsset?.id,
            date: date,
            payee: payee,
            notes: notes,
            tags: tagValues,
            status: transactionCleared ? "cleared" : "uncleared",
        }];

        var now = dayjs();
        await fetch('https://dev.lunchmoney.app/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessTokenInState,
            },
            body: JSON.stringify({
                debit_as_negative: true,
                transactions: transactionsToInsert,
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
                setChosenAsset(null);
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
    };

    return (
        <AppContainer>
            <Head>
                <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Milk Money" />
                <link rel="manifest" href="/manifest.json" />
                <title>Milk Money</title>
            </Head>

            <MainContainer>
                <HeaderContainer>
                    <span>&nbsp;</span>
                    <h1>Milk Money</h1>
                    <Gear onClick={() => showSettings(!settings)}>⚙️</Gear>
                </HeaderContainer>

                {(!authenticated || settings) && (
                    <Settings
                        accessTokenInState={accessTokenInState}
                        setAccessToken={setAccessToken}
                        setAuthenticated={setAuthenticated}
                        showSettings={showSettings}
                        showQuickButtons={showQuickButtons}
                        setShowQuickButtons={setShowQuickButtons}
                        recentCategories={recentCategories}
                        setRecentCategories={setRecentCategories}
                        recentAssets={recentAssets}
                        setRecentAssets={setRecentAssets}
                        recentCount={recentCount}
                        setRecentCount={setRecentCount}
                        tags={tags}
                        setTags={setTags}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleKeyDown={handleKeyDown}
                        handleBlur={handleBlur}
                        addAccessTokenFromHTMLElement={addAccessTokenFromHTMLElement}
                        accessRef={accessRef}
                    />
                )}

                {authenticated && !settings && (
                    <div>
                        {error.length > 0 &&
                            accessTokenInState !== null && accessTokenInState.length !== 0 && <p><WarningHolder>{error}</WarningHolder></p>}
                        <p></p>

                        {assets !== null && assets.length > 0 && (
                            <>
                                <ItemHolder>
                                    {assets.map((assetone, i) => (
                                        <ItemSelector
                                            key={i}
                                            value={assetone.id}
                                            selected={
                                                chosenAsset !== null &&
                                                chosenAsset.id === assetone.id
                                            }
                                            $dimmed={
                                                chosenAsset === null || (chosenAsset !== null &&
                                                chosenAsset.id !== assetone.id)
                                            }
                                            onClick={() => {
                                                setChosenAsset(assetone);
                                                updateRecentAssets(assetone);
                                            }}
                                        >
                                            {assetone.display_name}
                                        </ItemSelector>
                                    ))}
                                </ItemHolder>
                            </>
                        )}

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
                                <ItemHolder>
                                    {recentCategories.map((catone, i) => (
                                        <ItemSelector
                                            key={i}
                                            value={catone.category.id}
                                            selected={
                                                category !== null &&
                                                category.id === catone.category.id
                                            }
                                            $dimmed={
                                                category === null || (category !== null &&
                                                category.id !== catone.category.id)
                                            }
                                            onClick={() => {
                                                setChosenCategory(catone.category);
                                                updateRecentCategories(catone.category);
                                                setNoCategoryWarning(false);
                                            }}
                                        >
                                            {catone.category.name}
                                        </ItemSelector>
                                    ))}
                                </ItemHolder>

                                <Select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    options={categoryOptions}
                                    isSearchable={false}
                                    placeholder={recentCategories.length === 0 ? 'Select a category...' : 'More categories...'}
                                    styles={menuStyles}
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
                        <p></p>
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <label htmlFor="transactionCleared" style={{ marginRight: '10px' }}>Transaction Cleared: </label>
                            <Switch
                                onChange={handleTransactionClearedChange}
                                checked={transactionCleared}
                                id="transactionCleared"
                            />
                        </div>
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
                        A really basic app (<a href='https://github.com/dareiff/quick-add'>source</a>) that sends a cash transaction
                        to{' '}
                        <a href='https://lunchmoney.app/?refer=eg3r4y7t'>
                            Lunch Money
                        </a>
                        . It&apos;s all stored right on your phone once you add your api
                        key, and it “just works.”
                    </p>
                </Footer>
            )}
        </AppContainer>
    );
};

export default Home;
