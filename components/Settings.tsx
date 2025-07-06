import React, { KeyboardEventHandler } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import {
    TinyField,
    TinyButton,
    SelectContainer,
    StyledSelect,
    HelpIcon,
    HelpTooltip,
} from '../styles/styledComponents';

interface SettingsProps {
    accessTokenInState: string;
    setAccessToken: (token: string) => void;
    setAuthenticated: (authenticated: boolean) => void;
    showSettings: (show: boolean) => void;
    showQuickButtons: boolean;
    setShowQuickButtons: (show: boolean) => void;
    recentCategories: any[];
    setRecentCategories: (categories: any[]) => void;
    recentAssets: any[];
    setRecentAssets: (assets: any[]) => void;
    recentCount: number;
    setRecentCount: (count: number) => void;
    tags: readonly { label: string; value: string }[];
    setTags: (tags: readonly { label: string; value: string }[]) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleKeyDown: KeyboardEventHandler<HTMLInputElement>;
    handleBlur: () => void;
    addAccessTokenFromHTMLElement: () => void;
    accessRef: React.RefObject<HTMLInputElement>;
}

const Settings: React.FC<SettingsProps> = ({
    accessTokenInState,
    setAccessToken,
    setAuthenticated,
    showSettings,
    showQuickButtons,
    setShowQuickButtons,
    recentCategories,
    setRecentCategories,
    recentAssets,
    setRecentAssets,
    recentCount,
    setRecentCount,
    tags,
    setTags,
    inputValue,
    setInputValue,
    handleKeyDown,
    handleBlur,
    addAccessTokenFromHTMLElement,
    accessRef,
}) => {
    const handleRecentCountChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const value = parseInt(e.target.value, 10);
        setRecentCount(value);
    };

    return (
        <div style={{ width: '100%', margin: '20px 0' }}>
            {accessTokenInState === null || accessTokenInState.length === 0 ? (
                <div>
                    <h3>Welcome!</h3>
                    <p>
                        This app lets you quickly add manual transactions to
                        LunchMoney on the go.
                    </p>
                    <p>
                        To get started, add your access token (only stored
                        locally on your device.)
                    </p>
                    <TinyField
                        placeholder='LunchMoney Access Token'
                        type='text'
                        ref={accessRef}
                    />
                    <TinyButton onClick={addAccessTokenFromHTMLElement}>
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
                            Delete Access Token (...
                            {accessTokenInState.slice(-6)})
                        </TinyButton>
                    </div>
                    <div>
                        <p></p>
                        <TinyButton
                            onClick={() => {
                                setShowQuickButtons(!showQuickButtons);
                                showSettings(false);
                            }}
                        >
                            {showQuickButtons
                                ? 'Hide Quick Buttons'
                                : 'Show Quick Buttons'}
                        </TinyButton>
                    </div>
                    {recentCategories.length !== 0 && (
                        <div>
                            <p></p>
                            <TinyButton
                                onClick={() => {
                                    localStorage.removeItem('recentCategories');
                                    setRecentCategories([]);
                                    showSettings(false);
                                }}
                            >
                                Clear Recent Categories
                            </TinyButton>
                        </div>
                    )}
                    {recentAssets.length !== 0 && (
                        <div>
                            <p></p>
                            <TinyButton
                                onClick={() => {
                                    localStorage.removeItem('recentAssets');
                                    setRecentAssets([]);
                                    showSettings(false);
                                }}
                            >
                                Clear Recent Assets
                            </TinyButton>
                        </div>
                    )}
                    <div>
                        <p></p>
                        <label htmlFor='recentCount'>
                            Recent categories to show:
                        </label>
                        <SelectContainer>
                            <StyledSelect
                                id='recentCount'
                                value={recentCount}
                                onChange={handleRecentCountChange}
                            >
                                {Array.from(
                                    { length: 10 },
                                    (_, i) => i + 1,
                                ).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </StyledSelect>
                        </SelectContainer>
                    </div>
                    <div>
                        <p></p>
                        <label htmlFor='tags'>Tag all transactions as:</label>
                        <Popover placement='top-start'>
                            <PopoverTrigger>
                                <HelpIcon>?</HelpIcon>
                            </PopoverTrigger>
                            <PopoverContent>
                                <HelpTooltip>
                                    Tag(s) that will be added to all
                                    transactions (e.g., &quot;cash&quot;, &quot;
                                    manual-cash&quot;, &quot;milk-money&quot;,
                                    etc.) to make it easier to track
                                    transactions entered from this tool.
                                    <p></p>Leave empty to disable.
                                </HelpTooltip>
                            </PopoverContent>
                        </Popover>
                        <CreatableSelect
                            id='tags'
                            components={{ DropdownIndicator: null }}
                            inputValue={inputValue}
                            isClearable
                            isMulti
                            menuIsOpen={false}
                            onChange={(newValue) => {
                                setTags(newValue);
                            }}
                            onInputChange={(newValue: any) =>
                                setInputValue(newValue as string)
                            }
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            value={tags}
                            styles={{
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
                            }}
                            placeholder='Type to set tag(s)...'
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
