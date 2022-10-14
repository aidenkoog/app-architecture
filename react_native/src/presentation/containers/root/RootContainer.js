import { useEffect, useRef } from "react"
import { AppState, View, Text } from "react-native"
import styles from "../../stylesheets/StyleSet"
import Constants from "../../../constants/Constants"
import { atom, selector, useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'

function RootContainer() {

    /* recoil test */
    const setCount = useSetRecoilState(counting)
    const count = useRecoilValue(counting)
    const onPressed = () => {
        setCount((prev) => (prev) + 1)
    }

    /* appState (useRef) is not changed even though rendering is executed again. */
    const appState = useRef(AppState.currentState);

    /* detect current app state change */
    const onHandleAppStateChange = nextAppState => {
        console.log("root", 'appState nextAppState'
            + ' current: ', appState.current, ", next: ", nextAppState)
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === Constants.ROOT.APP_ACTIVE
        ) {
            console.log("root", 'app has come to the foreground!')
        }
        if (
            appState.current.match(/inactive|active/) &&
            nextAppState === Constants.ROOT.APP_BACKGROUND
        ) {
            console.log("root", 'app has come to the background!')
        }
        appState.current = nextAppState
    }

    useEffect(() => {
        /* when component is mounted */
        console.log("root", "component is mounted!")
        AppState.addEventListener(Constants.ROOT.APP_EVENT_TYPE, onHandleAppStateChange)

        /* when component is unmounted */
        return () => {
            console.log("root", "component is unmounted !!!")
            AppState.removeEventListener(Constants.ROOT.APP_EVENT_TYPE, onHandleAppStateChange);
        }
    }, [])

    return (
        <View style={styles.root_container}>
            <Text style={styles.root_text} onPress={onPressed}>Root-{count}</Text>
        </View>
    )
}

export const textState = atom({
    /* unique id (with respect to other atoms/selectors) */
    key: 'textState',
    /* default value */
    default: 'default-value'
})

export const counting = atom({
    key: "counting",
    default: 0,
})

/* 
 * if component type is class's, use the mapStateToProps function
 * bring state from store and put it to props. 
 * first argument : state from store
 * second argument : all props component currently have (possible to omit) 
 */
const mapStateToProps = (state) => {
    return {

    }
}

/*
 * if component type is class's, use the mapDispatchToProps function
 * send dispatch to props
 * dispatch role : send action to reducer
 * first argument : it's the same with store.dispatch() of Redux
 * second argument : all props component current have (possible to omit)
 */
const mapDispatchToProps = (dispatch) => ({
    saveProfile: () => dispatch(allActions.saveProfile())
})

export default RootContainer;
