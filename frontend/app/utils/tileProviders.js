export const TILE_PROVIDERS = {
  osm: {
    label: 'OpenStreetMap',
    exportDatetimeTextColor: '#000000',
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    },
  },
  gsi_std: {
    label: 'GSI Tiles',
    labelKey: 'tile.gsiStd',
    exportDatetimeTextColor: '#000000',
    style: {
      version: 8,
      sources: {
        gsi: {
          type: 'raster',
          tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '国土地理院',
        },
      },
      layers: [{ id: 'gsi', type: 'raster', source: 'gsi' }],
    },
  },
}
