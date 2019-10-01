import React, { Component } from 'react';
import LocalizaionView from './LocalixationView';
// import { ToastA/ndroid } from 'react-native';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    Slider,
    TextInput,
    Keyboard,
    ToastAndroid
} from "react-native";
import SpeechAndroid from 'react-native-kie-android-voice';
import Tts from 'react-native-tts';
import I18n from "i18n-js";
import styles from './Localizationstyles';
import * as RNLocalize from "react-native-localize";
import ar from '../../android/app/src/main/assets/translations/ar.json';
import en from "../../android/app/src/main/assets/translations/en.json";
import fr from "../../android/app/src/main/assets/translations/fr.json";
import hi from "../../android/app/src/main/assets/translations/hi.json";
import it from "../../android/app/src/main/assets/translations/it.json";
import nl from "../../android/app/src/main/assets/translations/nl.json";
import ja from "../../android/app/src/main/assets/translations/ja.json";
import es from "../../android/app/src/main/assets/translations/es.json";
import ru from "../../android/app/src/main/assets/translations/ru.json";


const locales = RNLocalize.getLocales();
if (Array.isArray(locales)) {
    I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
    en,
    fr,
    ar,
    hi,
    it,
    nl,
    ja,
    es,
    ru
};
const desc = 'We at enappd  deliver high quality app templates, themes and add-ons for you to jump start your startup, or take your business to the next level with an awesome app. We also offer multi-speciality teams for custom development projects ranging from Full stack development to virtual reality platforms.'
class LocalixationContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languageFrom: "",
            languageTo: "",
            languageCode: 'en',
            inputText: "",
            outputText: "",
            voices: [],
            ttsStatus: "initiliazing",
            selectedVoice: null,
            speechRate: 0.50,
            speechPitch: 1.02,
            text: desc,
            convertSentence: false,
            micOn: false,
            readTextInVoice: true,
        };
        Tts.addEventListener("tts-start", event =>
            this.setState({ ttsStatus: "started" })
        );
        Tts.addEventListener("tts-finish", event =>
            this.setState({ ttsStatus: "finished" })
        );
        Tts.addEventListener("tts-cancel", event =>
            this.setState({ ttsStatus: "cancelled" })
        );
        Tts.setDefaultRate(this.state.speechRate);
        Tts.setDefaultPitch(this.state.speechPitch);
        Tts.getInitStatus().then(this.initTts);
    }

    changeLanguage = (lang) => {
        console.log(lang);
        this.setState({ languageTo: lang, languageCode: lang, convertSentence: true });
    }



    initTts = async () => {
        const voices = await Tts.voices();
        const availableVoices = voices
            .filter(v => !v.networkConnectionRequired && !v.notInstalled)
            .map(v => {
                return { id: v.id, name: v.name, language: v.language };
            });
        let selectedVoice = null;
        if (voices && voices.length > 0) {
            selectedVoice = voices[4].id;
            try {
                await Tts.setDefaultLanguage(voices[0].language);
            } catch (err) {
                // My Samsung S9 has always this error: "Language is not supported"
                console.log(`setDefaultLanguage error `, err);
            }
            await Tts.setDefaultVoice(voices[0].id);
            this.setState({
                voices: availableVoices,
                selectedVoice,
                ttsStatus: "initialized"
            });
        } else {
            this.setState({ ttsStatus: "initialized" });
        }
    };

    readText = async () => {
        Tts.stop();
        Tts.speak(this.state.text);
    };

    setSpeechRate = async rate => {
        await Tts.setDefaultRate(rate);
        this.setState({ speechRate: rate });
    };

    setSpeechPitch = async rate => {
        await Tts.setDefaultPitch(rate);
        this.setState({ speechPitch: rate });
    };

    onVoicePress = async voice => {
        try {
            await Tts.setDefaultLanguage(voice.language);
        } catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
        await Tts.setDefaultVoice(voice.id);
        this.setState({ selectedVoice: voice.id });
    };

    renderVoiceItem = ({ item }) => {
        return (
            <Button
                title={`${item.language} - ${item.name || item.id}`}
                color={this.state.selectedVoice === item.id ? undefined : "#969696"}
                onPress={() => this.onVoicePress(item)}
            />
        );
    };


    handleTextReader = () => {
        this.setState({
            readTextInVoice: !this.state.readTextInVoice
        })
    }

    SpeechText = (value) => {
        this.setState({
            text: value
        })
    }

    render() {
        const { languageTo, convertSentence, micOn, readTextInVoice, voices, ttsStatus, selectedVoice, speechRate, speechPitch, text } = this.state
        return (
            <LocalizaionView
                languageTo={languageTo}
                changeLanguage={(lang) => this.changeLanguage(lang)}
                convertSentence={convertSentence}
                micOn={micOn}
                // _buttonClick={this._buttonClick}
                readTextInVoice={readTextInVoice}
                ttsStatus={ttsStatus}
                speechRate={speechRate}
                selectedVoice={selectedVoice}
                speechPitch={speechPitch}
                text={text}
                handleTextReader={this.handleTextReader}
                setSpeechRate={this.setSpeechRate}
                setSpeechPitch={this.setSpeechPitch}
                readText={this.readText}
                renderVoiceItem={this.renderVoiceItem}
                voices={voices}
                SpeechText={this.SpeechText}
            />


        );
    }
}

export default LocalixationContainer;