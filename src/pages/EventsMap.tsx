import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';
import mapMarkerImg from '../images/map-marker.png';
import * as api from '../services/api';
import { getFromNetworkFirst } from '../services/caching';
import { Event } from '../types/Event';

export default function EventsMap(props: StackScreenProps<any>) {
    const { navigation } = props;
    const authenticationContext = useContext(AuthenticationContext);
    const mapViewRef = useRef<MapView>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getFromNetworkFirst('events', api.getEvents())
                .then((allEvents) => {
                    const upcomingEvents = allEvents.filter(({ dateTime }) => new Date(dateTime) > new Date());
                    setEvents(upcomingEvents);
                    fitMapToEventsAndUser(upcomingEvents);
                })
                .catch((error) => console.log(error));
        }
    }, [isFocused]);

    const fitMapToEventsAndUser = async (upcomingEvents: Event[]) => {
        const coordinates: LatLng[] = upcomingEvents.map(({ position }) => position);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const { coords } = await Location.getCurrentPositionAsync();
            coordinates.push(coords);
        }
        mapViewRef.current?.fitToCoordinates(coordinates, { edgePadding: MapSettings.EDGE_PADDING });
    };

    const handleNavigateToCreateEvent = () => {};

    const handleNavigateToEventDetails = () => {};

    const handleLogout = async () => {
        AsyncStorage.multiRemove(['userInfo', 'accessToken']).then(() => {
            authenticationContext?.setValue(undefined);
            navigation.navigate('Login');
        });
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={MapSettings.DEFAULT_REGION}
                style={styles.mapStyle}
                customMapStyle={customMapStyle}
                showsMyLocationButton={false}
                showsUserLocation={true}
                rotateEnabled={false}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                mapPadding={MapSettings.EDGE_PADDING}
            >
                {events.map((event) => {
                    return (
                        <Marker
                            key={event.id}
                            coordinate={{
                                latitude: event.position.latitude,
                                longitude: event.position.longitude,
                            }}
                            onPress={handleNavigateToEventDetails}
                        >
                            <Image resizeMode="contain" style={{ width: 48, height: 54 }} source={mapMarkerImg} />
                        </Marker>
                    );
                })}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{events.length} events found</Text>
                <RectButton
                    style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
            <RectButton
                style={[styles.logoutButton, styles.smallButton, { backgroundColor: '#4D6F80' }]}
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="#FFF" />
            </RectButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    mapStyle: {
        ...StyleSheet.absoluteFillObject,
    },

    logoutButton: {
        position: 'absolute',
        top: 70,
        right: 24,

        elevation: 3,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,

        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },
});
