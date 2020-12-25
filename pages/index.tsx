import Head from 'next/head';
import { createRef, useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import useLongPress from '../utils/useLongPress';

const MoneyAdder = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  margin: 20px 0;
  justify-content: flex-start;

  > span {
    display: inline-flex;
    margin: 0 5px 0 0;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: rgba(253, 178, 154, 0.73);
  }
`;

const CategoryHolder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CategorySelector = styled.div`
  display: inline;
  padding: 5px 10px;
  margin: 5px 8px 5px 0;
  font-size: 14px;
  cursor: pointer;
  background-color: ${(props) =>
    props.selected ? 'rgba(74, 225, 94, 1.00)' : 'rgba(255, 205, 1, .20)'};
  border-radius: 8px;
  color: ${(props) => (props.dimmed ? '#909090' : '#202020')};
  font-weight: ${(props) => (props.selected ? 600 : 400)};
`;

const InputWrapper = styled.div`
  width: 100%;
  text-align: left;
  border: 2px solid #404040;
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
  background-color: ${(props) =>
    props.selected ? 'rgba(253, 178, 154, 0.73)' : '#fff'};
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
  background-color: ${(props) => (!props.selected ? '#eaeaea' : '#f79677')};
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

const reducer = (state, action) => {
  if (state.categories.filter((cat) => cat.id === action.value.id).length > 0) {
    const filterCats = state.categories.filter(
      (currentFavorite) => currentFavorite.id !== action.value.id
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
  const [favs, showFavs] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [cats, setCats] = useState<Array<LunchMoneyCategory>>(null);
  const [error, setError] = useState<string>('');
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [negative, setNegative] = useState<boolean>(false);

  const amountRef = createRef<HTMLInputElement>();

  const favoriteCategories = { categories: [] };

  const [favCats, dispatch] = useReducer(reducer, favoriteCategories);

  const downloadCats = async () => {
    await fetch('/api/getCat')
      .then((result) => result.json())
      .then((result: any) => {
        setCats(result.categories);
      })
      .catch((err) => {
        setError(
          'Something went wrong downloading categories. You might check your network connection, or your API key'
        );
        setCats(null);
      });
  };

  // everything related to clicking on a cateogry, or long-pressing

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
        .then((res) => {
          console.log(res);
          setLoading(false);
          setAmount(0);
          setSuccess(true);
        })
        .catch((err) => {
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
        {cats === null && <span>Loading...</span>}
        {error.length > 0 && <span>{error}</span>}
        <label htmlFor='lineItem'>Cash Entry:</label>
        <InputWrapper>
          <TheSingleStepper>
            <ValueChange
              onClick={() => setNegative(false)}
              selected={!negative}
            >
              +
            </ValueChange>
            <ValueChange onClick={() => setNegative(true)} selected={negative}>
              -
            </ValueChange>
          </TheSingleStepper>
          <DollarSign>$</DollarSign>
          <NumberInput
            id='lineItem'
            ref={amountRef}
            value={amount.toString()}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </InputWrapper>
        <MoneyAdder>
          <div style={{ alignSelf: 'center', margin: '0 5px 0 0' }}>
            Quick Entry:
          </div>
          <span onClick={() => setAmount(amount + 1)}>$1</span>
          <span onClick={() => setAmount(amount + 2)}>$2</span>
          <span onClick={() => setAmount(amount + 5)}>$5</span>
          <span onClick={() => setAmount(amount + 10)}>$10</span>
        </MoneyAdder>
        {favCats.categories.length > 0 && (
          <BubbleHolder>
            {favCats.categories.map((cat) => {
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
        {cats !== null ? (
          <CategoryHolder>
            {cats.map((category, i) => (
              <CategorySelector
                key={i}
                value={category.id}
                selected={categoryID === category.id}
                dimmed={categoryID !== category.id && categoryID !== null}
                onClick={() => setCategoryID(category.id)}
              >
                {favCats.categories.filter((cat) => cat.id === category.id)
                  .length > 0 && <span>😍</span>}
                {category.name}
              </CategorySelector>
            ))}
          </CategoryHolder>
        ) : (
          <CategorySelector>Loading...</CategorySelector>
        )}
        <Button onClick={() => insertTransaction()}>Add Transaction</Button>
      </MainContainer>

      <Footer>
        <a href='https://derekr.net' target='_blank' rel='noopener noreferrer'>
          team fun
        </a>
        <p>
          A really basic app that sends a cash transaction (probably) to{' '}
          <a href='https://lunchmoney.app/'>Lunch Money</a>. It’s all stored
          right on your phone once you add your api key, and it “just works.”
        </p>
      </Footer>
    </AppContainer>
  );
};

export default Home;
