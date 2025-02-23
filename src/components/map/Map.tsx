import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { WaypointModel } from 'domain/waypoint-model';
import secToReadable from 'utils/sec-to-readable';

// Import for the map
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

import './Map.css';

type MapProps = {
    current_time?: number;
    waypoints?: WaypointModel[];
    onPointTimeSelected: Function;
}

export class Map extends React.Component<MapProps> {
    render() {
        // define map icon (to prevent error)
        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        const { waypoints } = this.props;
        if (waypoints) {
            // get max and min lat and lng to size the map
            const lats = waypoints.map(obj => parseFloat(obj.lat)).sort();
            const lngs = waypoints.map(obj => parseFloat(obj.lng)).sort();
            return (
                <MapContainer
                    bounds={[
                        [lats[0], lngs[0]],
                        [lats[lats.length - 1], lngs[lngs.length - 1]]
                    ]}
                    zoom={10}
                    scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {waypoints.map((point: WaypointModel, index: number) => (
                        <Marker
                            key={index}
                            position={[parseInt(point.lat), parseInt(point.lng)]} >
                            <Popup>
                                {point.label}<br />
                                <Button
                                    onClick={() => this.props.onPointTimeSelected(parseInt(point.timestamp))}>
                                    {secToReadable(point.timestamp)}
                                </Button>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            );
        } else {
            return (
                <div>
                    <p>Waypoint in progress...</p>
                    <CircularProgress size={60} color="inherit" />
                </div>
            )
        }
    }
}