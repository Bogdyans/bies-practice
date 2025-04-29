"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L, {LatLngExpression} from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const LOCATIONS = [
    { id: 1, name: "Офис 1", coordinates: [55.751244, 37.618423], description: "Главный офис" },
    { id: 2, name: "Офис 2", coordinates: [55.753215, 37.622504], description: "Технический центр" },
    { id: 3, name: "Произвoдство", coordinates: [55.758815, 37.633664], description: "Производственный комплекс" },
    { id: 4, name: "Склад", coordinates: [55.743301, 37.625031], description: "Логистический центр" },
    { id: 5, name: "Учебный центр", coordinates: [55.758463, 37.601079], description: "Центр обучения" },
]

// Fix for Leaflet icon issue in Next.js
const createLeafletIcon = (iconUrl: string) => {
    return L.icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
}

// Component to handle routing between points
function RoutingMachine({ startPoint, endPoint }: { startPoint: number[]; endPoint: number[] }) {
    const map = useMap()

    useEffect(() => {
        if (!startPoint || !endPoint) return

        const routingControl = L.Routing.control({
            waypoints: [L.latLng(startPoint[0], startPoint[1]), L.latLng(endPoint[0], endPoint[1])],
            lineOptions: {
                styles: [{ color: "#e11d48", weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0,
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,

            // Add these options to hide the instructions panel
            showInstructions: false,
            collapsible: true,
            collapsed: true,
            // Hide the control completely
            containerClassName: "hidden",
        }).addTo(map)

        return () => {
            map.removeControl(routingControl)
        }
    }, [map, startPoint, endPoint])

    return null
}

export default function MapNavigation() {
    const [startLocation, setStartLocation] = useState<number | null>(null)
    const [endLocation, setEndLocation] = useState<number | null>(null)
    const [startCoordinates, setStartCoordinates] = useState<number[] | null>(null)
    const [endCoordinates, setEndCoordinates] = useState<number[] | null>(null)
    const [mapInitialized, setMapInitialized] = useState(false)

    // Set default map position to Moscow
    const defaultPosition: LatLngExpression = [55.751244, 37.618423]

    useEffect(() => {
        // Set start coordinates when start location changes
        if (startLocation) {
            const location = LOCATIONS.find((loc) => loc.id === startLocation)
            if (location) {
                setStartCoordinates(location.coordinates)
            }
        } else {
            setStartCoordinates(null)
        }
    }, [startLocation])

    useEffect(() => {
        // Set end coordinates when end location changes
        if (endLocation) {
            const location = LOCATIONS.find((loc) => loc.id === endLocation)
            if (location) {
                setEndCoordinates(location.coordinates)
            }
        } else {
            setEndCoordinates(null)
        }
    }, [endLocation])

    useEffect(() => {
        // Fix for Leaflet marker icons in Next.js
        setMapInitialized(true)
    }, [])

    return (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto p-4">
                    <div className="md:col-span-2">
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle>Карта навигации</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[600px] rounded-md overflow-hidden border border-gray-200">
                                    {mapInitialized && (
                                        <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            {LOCATIONS.map((location) => (
                                                <Marker
                                                    key={location.id}
                                                    position={location.coordinates as [number, number]}
                                                    icon={createLeafletIcon("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png")}
                                                >
                                                    <Popup>
                                                        <div>
                                                            <h3 className="font-medium">{location.name}</h3>
                                                            <p>{location.description}</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            ))}

                                            {startCoordinates && endCoordinates && (
                                                <RoutingMachine startPoint={startCoordinates} endPoint={endCoordinates} />
                                            )}
                                        </MapContainer>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle>Построить маршрут</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Откуда</label>
                                        <Select
                                            value={startLocation?.toString() || ""}
                                            onValueChange={(value) => setStartLocation(Number.parseInt(value))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите начальную точку" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LOCATIONS.map((location) => (
                                                    <SelectItem key={location.id} value={location.id.toString()}>
                                                        {location.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Куда</label>
                                        <Select
                                            value={endLocation?.toString() || ""}
                                            onValueChange={(value) => setEndLocation(Number.parseInt(value))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Выберите конечную точку" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LOCATIONS.map((location) => (
                                                    <SelectItem key={location.id} value={location.id.toString()}>
                                                        {location.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {startLocation && endLocation && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                                        <h3 className="font-medium text-gray-900 mb-2">Информация о маршруте</h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <span className="font-medium">Начальная точка:</span>{" "}
                                                {LOCATIONS.find((loc) => loc.id === startLocation)?.name}
                                            </p>
                                            <p>
                                                <span className="font-medium">Конечная точка:</span>{" "}
                                                {LOCATIONS.find((loc) => loc.id === endLocation)?.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm mt-6">
                            <CardHeader className="pb-2">
                                <CardTitle>Доступные локации</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="divide-y divide-gray-200">
                                    {LOCATIONS.map((location) => (
                                        <li key={location.id} className="py-3">
                                            <h3 className="font-medium text-gray-900">{location.name}</h3>
                                            <p className="text-sm text-gray-500">{location.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

    )
}
