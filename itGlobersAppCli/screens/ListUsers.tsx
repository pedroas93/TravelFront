import {
    Image,
    Platform,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    View,
    StatusBar,
    FlatList
} from 'react-native';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types';
import { fetchUsersList, User } from '../slices/userSlice';
import { RootState } from '../store/store';

const UserListItem: FunctionComponent<{ user: User }> = ({ user }) => {
    return (
        <View style={styles.containerList}>
            <Image style={styles.thumbnail} source={{ uri: user.avatar }} />
            <Text style={styles.nameText}>{user.last_name} {user.first_name} </Text>
        </View>
    );
};

export default function SingupScreen({}: any) {

    const dispatch = useDispatch();

    const screenState = useSelector((state: RootState) => state.userDataPersist);

    useEffect(() => {
        dispatch(fetchUsersList({ page: 1 }));
    }, []);

    const handleOnEndReached = () => {
        if (!screenState.loading) {
            dispatch(fetchUsersList({ page: screenState.nextPage }));
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : 'height'} style={styles.container} enabled>
            <StatusBar barStyle="dark-content" />

                <View style={styles.topHeaderContainer}>
                    <Text style={styles.topHeaderTitle}>lista de tus usuarios: </Text>
                </View>
                <View>
                    {screenState.loading && <Text>LOADING</Text>}
                    <FlatList
                        data={screenState.users}
                        keyExtractor={(_, index) => {
                            return index.toString();
                        }}
                        renderItem={({ item }) => <UserListItem user={item} />}
                        onEndReached={handleOnEndReached}
                    />
                </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    topHeaderContainer: {
        marginTop: 15,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlign: "left",
    },
    topHeaderTitle: {
        textAlign: "left",
        fontSize: 32,
        fontWeight: "bold",
        color: "#000000"
    },
    container: {
        flex: 1,
        backgroundColor: "#ffff",
        padding: 10,
        paddingBottom: 30
    },
    containerList: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    nameText: {
        padding: 15,
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: 'purple',
        borderWidth: 3,
    },
});
