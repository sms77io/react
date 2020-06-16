import '@webscopeio/react-textarea-autocomplete/style.css';
import React, {Component, SyntheticEvent} from 'react';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import Sms77Client from 'sms77-client';
import emoji from '@jukben/emoji-search';
import * as smshelper from 'smshelper';

export type AppProps = {
    apiKey?: string
    to?: string
}

export type AppState = { [P in keyof AppProps]?: AppProps[P] } & {
    apiKey: AppProps['apiKey']
    charCount: number
    disabled: boolean
    errors: string[]
    msgCount: number
    to: AppProps['to']
}

const API_KEY_REQUIRED = 'You must set an API key in order to send SMS.';
const TO_REQUIRED = 'You must specify a recipient in order to send SMS.';

export default class Sms77 extends Component<AppProps, AppState> {
    state = {
        apiKey: this.props.apiKey || '',
        charCount: 0,
        disabled: true,
        errors: [],
        msgCount: 1,
        to: this.props.apiKey || '',
    };

    textarea: HTMLTextAreaElement | null = null;

    private get helperTemplate() {
        return `${this.state.charCount} (${this.state.msgCount})`;
    }

    componentDidMount(): void {
        if (this.state.apiKey.length) {
            this.setState({disabled: false});
        }

        this.textarea!.insertAdjacentHTML(
            'afterend', `<span class='sms77react--chars'>${this.helperTemplate}</span>`);
    }

    componentDidUpdate(): void {
        (this!.textarea!.nextSibling! as HTMLSpanElement).innerText = this.helperTemplate;
    }

    render() {
        const handleSubmit = async (ev: SyntheticEvent<HTMLFormElement>): Promise<Partial<AppState> | void> => {
            ev.preventDefault();

            const {to, apiKey} = await promptTo();

            const text = this.textarea!.value;
            const errors: AppState['errors'] = [];

            if ('' === to) {
                errors.push(TO_REQUIRED);
            }

            if ('' === apiKey) {
                errors.push(API_KEY_REQUIRED);
            }

            if ('' === text.trim()) {
                errors.push('Please do not spam people by sending them empty messages.');
            }

            if (errors.length) {
                this.setState({errors: [...this.state.errors, ...errors]});
            } else {
                await new Sms77Client(apiKey as string, 'react').sms({to: to as string, text});

                this.textarea!.value = '';

                handleChange();
            }
        };

        const handleChange = () => this.setState({
            charCount: smshelper.count(this.textarea!.value),
            msgCount: smshelper.parts(this.textarea!.value),
        });

        const Item = ({entity: {name, char}}: any) => <div>{`${name}: ${char}`}</div>;

        const Loading = () => <span>Loading...</span>;

        const errors = this.state.errors.map((e, i) => <li key={i}>{e}</li>);

        const promptApiKey = (): Promise<AppState> => {
            return new Promise(resolve => {
                const apiKey = prompt('Please type in your API key. Find it at https://app.sms77.io/dashboard.');
                let state: Partial<AppState> = {};

                if (apiKey && '' !== apiKey.trim()) {
                    state = {apiKey, disabled: false};
                } else {
                    state = {errors: [...this.state.errors, API_KEY_REQUIRED]};
                }

                this.setState(state as AppState, () => resolve(this.state));
            });
        };

        const promptTo = (): Promise<AppState> => {
            return new Promise(resolve => {
                const to = prompt('Please type in the recipient number or contact name.');
                let state = {};

                if (to && '' !== to.trim()) {
                    state = {to};
                } else {
                    state = {errors: [...this.state.errors, TO_REQUIRED]};
                }

                this.setState(state as AppState, () => resolve(this.state));
            });
        };

        const button = this.state.apiKey.length
            ? <button type='submit'>OK</button>
            : <button type='button' onClick={promptApiKey}>Set API key</button>;

        return <form id='sms77react' onSubmit={handleSubmit}>
            <ul>{errors}</ul>

            <ReactTextareaAutocomplete
                innerRef={t => this.textarea = t}
                onChange={handleChange}
                loadingComponent={Loading}
                minChar={1}
                trigger={{
                    ':': {
                        component: Item,
                        dataProvider: token => emoji(token)
                            .slice(0, 10)
                            .map(({name, char}) => ({name, char})),
                        output: (item: any) => item.char,
                    }
                }}
            />

            {button}
        </form>;
    }
}