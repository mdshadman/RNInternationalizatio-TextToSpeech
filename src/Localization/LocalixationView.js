import React, { Component } from 'react'
import { Container, Content, Text, Button, Icon } from 'native-base';
import { } from 'react-native';
import styles from './Localizationstyles';
import Languages from './languages.json';
import I18n from "i18n-js";
import {
    View,
    FlatList,
    Slider,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Picker
} from "react-native";
const LocalizaionView = (props) => {
    const {
        convertSentence,
        handleTextReader,
        SpeechText,
        renderVoiceItem,
        voices,
        languageTo,
        changeLanguage,
        readText,
        readTextInVoice,
        ttsStatus,
        selectedVoice,
        speechRate,
        setSpeechRate,
        speechPitch,
        setSpeechPitch,
        text
    } = props
    return (
        <Container>
            {readTextInVoice &&
                <View style={styles.container}>
                    <View style={styles.input}>
                        <Text>{I18n.t("hello")}</Text>
                    </View>

                    <Picker
                        selectedValue={languageTo}
                        onValueChange={lang => changeLanguage(lang)}
                    >
                        {Object.keys(Languages).map(key => (
                            <Picker.Item label={Languages[key]} value={key} key={Languages[key]} />
                        ))}
                    </Picker>
                    <View>
                        {convertSentence &&
                            <View style={styles.output}>
                                <Text>
                                    {/* {I18n.t("hello")} */}
                                    {I18n.t("hello", { locale: languageTo })}
                                </Text>
                            </View>
                        }
                    </View>
                </View>
            }
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleTextReader}
            >
                {readTextInVoice &&
                    <Text style={styles.submitButtonText}> Go to Read Text </Text>
                }
                {!readTextInVoice &&
                    <Text style={styles.submitButtonText}> Go to translate  Text </Text>
                }
            </TouchableOpacity>
            {!readTextInVoice &&
                <View style={styles.containerSpeech}>
                    <Text style={styles.title}>{`React Native Text To Speech Example`}</Text>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={readText}
                    >
                        <Text style={styles.submitButtonText}> Start Reading Text </Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>{`Status: ${ttsStatus || ""}`}</Text>
                    <Text style={styles.label}>{`Selected Voice: ${selectedVoice || ""}`}</Text>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderLabel}>{`Speed: ${speechRate.toFixed(2)}`}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0.01}
                            maximumValue={0.99}
                            value={speechRate}
                            onSlidingComplete={setSpeechRate}
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text
                            style={styles.sliderLabel}
                        >{`Pitch: ${speechPitch.toFixed(2)}`}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0.5}
                            maximumValue={2}
                            value={speechPitch}
                            onSlidingComplete={setSpeechPitch}
                        />
                    </View>

                    <TextInput
                        style={styles.textInput}
                        multiline={true}
                        onChangeText={text => SpeechText(text)}
                        value={text}
                        onSubmitEditing={Keyboard.dismiss}
                    />
                    <FlatList
                        keyExtractor={item => item.id}
                        renderItem={renderVoiceItem}
                        extraData={selectedVoice}
                        data={voices}
                    />

                </View>
            }
        </Container>
    )
}
export default LocalizaionView;