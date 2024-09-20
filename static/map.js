// Inicializa o mapa centrado na UEG
var map = L.map('map').setView([-16.380598, -48.9474], 18);

// Camada base - Mapa de ruas do OpenStreetMap
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Camada de Satélite do Mapbox
var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicG93ZXJncmVldGNoZW4iLCJhIjoiY20wbG1haWliMDdjbDJqcG1wem9hZzAwbiJ9.kJbmHMPQkZQQG4cn22Tvqg', {
    maxZoom: 20,
    attribution: '© Mapbox'
});

// Controle de camadas para alternar entre ruas e satélite
var baseMaps = {
    "Ruas": streets,
    "Satélite": satellite
};

L.control.layers(baseMaps).addTo(map);

L.control.scale({
    position: 'bottomright',   // Posição do controle no mapa
    metric: true,             // Unidades métricas (metros/km)
    imperial: false           // Desativa unidades imperiais (milhas/feet)
}).addTo(map);

// Função para adicionar interatividade aos polígonos
function onEachFeature(feature, layer) {
    // Adiciona um popup vazio ao clicar no polígono
    if (feature.properties && feature.properties.name) {
        let popupContent = `
           <div  class="text-center">
                <h4>${feature.properties.name}</h4>
                <div class="row">
                    <div class="col-md-6">
                        <img class="img-fluid custom-image" src="${feature.properties.image}"  alt="Image 1" />
                    </div>
                    <div class="col-md-6">
                        <img class="img-fluid custom-image" src="${feature.properties.image}"  alt="Image 2" />
                    </div>
                </div>
                <div class="additional-text">
                    <p>A tecnologia transformou a maneira como nos comunicamos, trabalhamos e vivemos. Nos últimos anos, o avanço das redes sociais, aplicativos e dispositivos móveis facilitou a conexão entre pessoas de diferentes partes do mundo. Essa revolução digital não só proporcionou mais conveniência, mas também trouxe desafios, como a privacidade online e a disseminação de desinformação. A educação também foi impactada, com plataformas de aprendizado remoto ganhando destaque. É essencial que, diante dessas mudanças, desenvolvamos um pensamento crítico e habilidades digitais, preparando-nos para navegar em um mundo cada vez mais interconectado e dinâmico, onde a adaptabilidade é fundamental.</p>
                </div>
            </div>
        `;
        layer.bindPopup(popupContent);
    }

    // Evento de clique
    layer.on('click', function (e) {
        // Popup será exibido ao clicar no polígono
    });

    // Evento ao passar o mouse sobre o polígono
    layer.on('mouseover', function (e) {
        layer.setStyle({
            fillColor: 'yellow',
            fillOpacity: 0.7
        });
    });

    // Evento ao remover o mouse do polígono
    layer.on('mouseout', function (e) {
        layer.setStyle({
            fillColor: feature.properties.color || 'lightblue',
            fillOpacity: 0.5
        });
    });
}

// Carrega o polígono GeoJSON
fetch('/static/data/mesclado.geojson')
    .then(response => response.json())
    .then(data => {
        // Adiciona os polígonos ao mapa com interatividade
        L.geoJSON(data, {
            style:function(feature){
                return {
                    color: feature.properties.border, // Cor da borda, conforme definida nas propriedades
                    weight: 2, // Espessura da borda
                    fillColor: feature.properties.color, // Cor do preenchimento, conforme definida nas propriedades
                    fillOpacity: 0.5 // Opacidade do preenchimento
                };
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Erro ao carregar o GeoJSON:', error));
