import React, { useState, useMemo } from 'react';
import { X, Search, ShieldAlert, Zap, ArrowRight, Check, Activity, AlertTriangle, Info, Thermometer, MapPin, Lightbulb, Bug, Lungs, Bird, Droplet, CircleDot, Biohazard } from './Icons';
const renderDiseaseIcon = (type) => {
  switch (type) {
    case 'bug': return <Bug size={20} className="text-amber" />;
    case 'lungs': return <Lungs size={20} className="text-cyan" />;
    case 'bird': return <Bird size={20} className="text-crimson" />;
    case 'droplet': return <Droplet size={20} className="text-cyan" />;
    case 'circle-dot': return <CircleDot size={20} className="text-crimson" />;
    case 'biohazard': default: return <Biohazard size={20} className="text-crimson" />;
  }
};
import { DISEASES_CATALOG, DISEASE_CATEGORIES, DANGER_LEVELS } from '../data/diseasesCatalog';

export default function DiseaseCatalogModal({
  isOpen,
  onClose,
  activeDiseaseId,
  onSelectDisease,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDanger, setSelectedDanger] = useState('all');

  const filteredDiseases = useMemo(() => {
    return DISEASES_CATALOG.filter((item) => {
      // Filtro de búsqueda textual
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.manabiContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.symptoms.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro de categoría
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Filtro de nivel de peligro
      const matchesDanger = selectedDanger === 'all' || item.dangerLevel === selectedDanger;

      return matchesSearch && matchesCategory && matchesDanger;
    });
  }, [searchQuery, selectedCategory, selectedDanger]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-catalog" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Catálogo */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge badge-crimson">
              <Thermometer size={22} className="text-crimson" />
            </div>
            <div>
              <div className="modal-title">CATÁLOGO EPIDEMIOLÓGICO & PATÓGENOS</div>
              <div className="modal-sub">
                Clasificación por peligrosidad, transmisibilidad y contexto de Manabí (Dengue, Zombi, COVID, Cólera)
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={20} />
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="catalog-filters-bar">
          {/* Input de Búsqueda */}
          <div className="catalog-search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Buscar por patógeno, síntomas o contexto (ej. Dengue, Tarqui, Cólera)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtros de Categoría */}
          <div className="category-pills-row">
            {DISEASE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtros por Nivel de Peligro */}
          <div className="danger-pills-row">
            <span className="danger-lbl">Nivel de Peligro:</span>
            {DANGER_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedDanger(lvl.id)}
                className={`danger-pill ${selectedDanger === lvl.id ? 'active' : ''}`}
                style={selectedDanger === lvl.id && lvl.color ? { borderColor: lvl.color, color: lvl.color } : {}}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Enfermedades */}
        <div className="modal-body catalog-cards-grid">
          {filteredDiseases.length === 0 ? (
            <div className="no-results-box">
              <Info size={24} className="text-cyan" />
              <span>No se encontraron patógenos con los filtros seleccionados.</span>
            </div>
          ) : (
            filteredDiseases.map((disease) => {
              const isCurrent = activeDiseaseId === disease.id;

              return (
                <div
                  key={disease.id}
                  className={`disease-card ${isCurrent ? 'active-current-disease' : ''}`}
                >
                  <div className="disease-card-header">
                    <div className="disease-icon-badge">{renderDiseaseIcon(disease.iconType)}</div>
                    <div className="disease-title-area">
                      <div className="disease-name">{disease.name}</div>
                      <div className="disease-sci">{disease.scientificName}</div>
                    </div>
                    <span
                      className={`danger-tag tag-${disease.dangerLevel}`}
                    >
                      {disease.dangerLevel.toUpperCase()}
                    </span>
                  </div>

                  {/* Telemetría Epidemiológica */}
                  <div className="disease-telemetry-grid">
                    <div className="telemetry-item">
                      <span className="tel-lbl">R₀ ESTIMADO</span>
                      <strong className="tel-val text-crimson">{disease.r0}</strong>
                    </div>
                    <div className="telemetry-item">
                      <span className="tel-lbl">TRANSMISIÓN (β)</span>
                      <strong className="tel-val text-amber">{disease.beta}</strong>
                    </div>
                    <div className="telemetry-item">
                      <span className="tel-lbl">INCUBACIÓN</span>
                      <strong className="tel-val text-cyan">{disease.incubationDays} días</strong>
                    </div>
                    <div className="telemetry-item">
                      <span className="tel-lbl">CONTAGIO</span>
                      <strong className="tel-val text-emerald">{disease.contagionLevel}</strong>
                    </div>
                  </div>

                  <div className="disease-details-box">
                    <div className="detail-line">
                      <strong>Vía:</strong> {disease.transmissionMedium}
                    </div>
                    <div className="detail-line">
                      <strong>Síntomas:</strong> {disease.symptoms}
                    </div>
                    <div className="detail-line context-highlight">
                      <span className="flex items-center gap-1"><MapPin size={13} className="text-cyan shrink-0" /><strong>Realidad en Manta:</strong></span> {disease.manabiContext}
                    </div>
                  </div>

                  <div className="disease-card-footer">
                    <div className="footer-strategy-hint">
                      <span className="flex items-center gap-1.5"><Lightbulb size={13} className="text-amber shrink-0" /><em>Estrategia sugerida:</em></span> {disease.recommendedStrategy}
                    </div>

                    <button
                      onClick={() => {
                        onSelectDisease(disease);
                        onClose();
                      }}
                      className={`btn-select-disease ${isCurrent ? 'btn-active' : ''}`}
                    >
                      {isCurrent ? (
                        <>
                          <Check size={16} />
                          <span>Patógeno Activo</span>
                        </>
                      ) : (
                        <>
                          <span>Cargar en Simulación</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie del Modal */}
        <div className="modal-footer">
          <div className="footer-hint">
            <span className="flex items-center gap-1.5"><Lightbulb size={14} className="text-amber shrink-0" /><span>Al seleccionar cualquier patógeno</span></span>, el motor ajusta la tasa de contagio (β), días de incubación y calibración para Manta.
          </div>
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
