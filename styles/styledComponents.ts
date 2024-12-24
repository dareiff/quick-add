import styled from 'styled-components';

export const MoneyAdder = styled.div`
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

export const Gear = styled.div`
    font-size: 22px;
    cursor: pointer;
    justify-self: flex-end;
`;

export const CategoryHeaderGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h3 {
        margin: 0;
        display: inline;
    }
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    h1 {
        margin: 5px 20px;
        font-size: 30px;
    }
`;

export const ItemHolder = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 20px 0;
`;

interface ItemI {
    selected: boolean;
    $dimmed: boolean;
    value?: number;
}
export const ItemSelector = styled.div<ItemI>`
    display: inline-block;
    padding: 12px 12px;
    margin: 5px;
    font-size: 17px;
    cursor: pointer;
    background-color: ${(props: ItemI) =>
        props.selected ? '#006bb3' : '#e6e6e6'};
    border-radius: 8px;
    color: ${(props: ItemI) => (props.$dimmed ? 'black' : 'white')};
`;

export const InputWrapper = styled.div`
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

export const TheSingleStepper = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
`;

export const ValueChange = styled.div`
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

export const AppContainer = styled.div`
    min-height: 100vh;
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const MainContainer = styled.div`
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
        font-size: 16px;
    }
`;

export const Button = styled.button`
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

export const TinyField = styled.input`
    padding: 12px 12px;
    margin: auto;
    display: inline;
    color: #404040;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid #404040;
    width: 100%;
`;

export const TinyButton = styled.button`
    width: 100%;
    background-color: #006bb3;
    color: #fff;
    padding: 10px 30px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 700;
`;

export const NumberInput = styled.input`
    font-size: 40px;
    border: none;
    width: 50%;
    margin: 0 0 0 10px;
    display: inline-block;

    &:focus {
        outline: none;
    }
`;

export const DollarSign = styled.span`
    font-size: 22px;
    margin: 0 0 0 30px;
`;

export const SuccessHolder = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    p {
        font-size: 17px;
    }
`;

export const WarningHolder = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 17px;
    color: red;
`;

export const SelectContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 10px 0;
`;

export const StyledSelect = styled.select`
    width: 100%;
    padding: 8px;
    font-size: 20px;
    border: 1px solid #404040;
    border-radius: 5px;
    color: '#404040',
    background-color: '#fff',
`;

export const Footer = styled.div`
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

export const HelpIcon = styled.span`
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    margin-left: 5px; /* Adjust as needed */

    &:hover {
        background-color: #eee;
    }
`;

export const HelpTooltip = styled.div`
    font-size: 16px;
    background-color: #99cbff;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    max-width: 300px;
`;
