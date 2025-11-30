<template>
  <div class="add-shelter-wrap">
    <header class="page-head">
      <div>
        <h2>Evacuation Shelters</h2>
        <p class="desc">Manage evacuation areas and shelter information</p>
      </div>
      <button class="btn-refresh" type="button" @click="refreshShelterList">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
        Refresh Data
      </button>
    </header>

    <div class="form-modal">
      <div class="modal-content">
        <h3>Add New Shelter</h3>
        <p class="modal-desc">Provide accurate details for the evacuation shelter.</p>

        <form @submit.prevent="submit" class="shelter-form">
          <div class="form-row">
            <label class="form-group">
              <span>Shelter Name*</span>
              <input 
                v-model="form.name" 
                placeholder="Enter shelter name"
                @input="onShelterNameInput"
              />
            </label>
          </div>

          <div class="form-row">
            <label class="form-group">
              <span>Address / Location*</span>
              <input 
                v-model="form.address" 
                placeholder="Enter complete address"
                @input="onAddressInput"
              />
            </label>
          </div>

          <div class="form-row two">
            <label class="form-group">
              <span>Coordinates</span>
              <input 
                v-model="form.latitude" 
                placeholder="Latitude"
                @input="onLatitudeInput"
              />
            </label>
            <label class="form-group">
              <span></span>
              <input 
                v-model="form.longitude" 
                placeholder="Longitude"
                @input="onLongitudeInput"
              />
            </label>
            <button type="button" class="map-btn" @click="openMapPicker">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </button>
          </div>

          <div class="form-row two">
            <label class="form-group">
              <span>Capacity*</span>
              <input 
                v-model="form.capacity" 
                type="number" 
                placeholder="0"
                @input="onCapacityInput"
              />
            </label>
            <label class="form-group">
              <span>Status*</span>
              <select 
                v-model="form.status"
                @change="onStatusChange"
              >
                <option>Select status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Full</option>
              </select>
            </label>
          </div>

          <div class="form-row two">
            <label class="form-group">
              <span>Contact Person*</span>
              <input 
                v-model="form.contact_person" 
                placeholder="Enter contact person name"
                @input="onContactPersonInput"
              />
            </label>
            <label class="form-group">
              <span>Contact Number*</span>
              <input 
                v-model="form.contact_number" 
                placeholder="Enter contact number"
                @input="onContactNumberInput"
              />
            </label>
          </div>

          <div class="form-row">
            <label class="form-group">
              <span>Additional Notes</span>
              <textarea 
                v-model="form.notes" 
                placeholder="Enter any additional information about the shelter."
                @input="onNotesInput"
              ></textarea>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="cancel">Cancel</button>
            <button type="submit" class="btn-save">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-icon">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              Save Shelter
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="mapPickerVisible" class="map-picker-overlay">
      <div class="map-picker-panel">
        <header>
          <h4>Pick Location on Map</h4>
          <p>Select the location to auto-fill the coordinates.</p>
        </header>
        <div id="shelter-map" class="shelter-map"></div>
        <p v-if="selectedCoordinates" class="map-coords">Latitude: {{ selectedCoordinates.lat.toFixed(6) }}, Longitude: {{ selectedCoordinates.lng.toFixed(6) }}</p>
        <div class="map-picker-footer">
          <button type="button" class="btn-cancel" @click="closeMapPicker">Cancel</button>
          <button type="button" class="btn-save" :disabled="!selectedCoordinates" @click="confirmMapSelection">Use Coordinates</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { addShelter, resetShelters } from '../stores/shelterStore'
const navigate = inject('navigate', () => {})

const form = reactive({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  capacity: '',
  status: '',
  contact_person: '',
  contact_number: '',
  notes: ''
})

const submittedData = ref(null)
const mapPickerVisible = ref(false)
const selectedCoordinates = ref(null)
const mapInstance = ref(null)
const mapMarker = ref(null)

function submit() {
  if (!form.name || !form.address || !form.capacity || !form.status) {
    alert('Please fill out required fields')
    return
  }

  const payload = {
    name: form.name.trim(),
    address: form.address.trim(),
    capacity: Number(form.capacity),
    status: form.status,
    contact_person: form.contact_person.trim(),
    contact_number: form.contact_number.trim(),
    latitude: form.latitude,
    longitude: form.longitude,
    notes: form.notes.trim()
  }

  submittedData.value = { ...payload }
  addShelter({
    ...payload,
    current_occupancy: 0,
    shelter_type: 'Multipurpose Center',
    region: 'Caraga Region'
  })

  console.log('Submitting shelter:', submittedData.value)
  alert(`Shelter "${form.name}" saved successfully!\nCapacity: ${form.capacity}\nLocation: ${form.address}`)

  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  selectedCoordinates.value = null
  hideMapPicker()
  navigate('shelters')
}

function cancel() {
  navigate('shelters')
}

function refreshShelterList() {
  resetShelters()
  navigate('shelters')
  alert('Shelter list refreshed and default data restored.')
}

async function openMapPicker() {
  mapPickerVisible.value = true
  await nextTick()

  if (!mapInstance.value) {
    mapInstance.value = L.map('shelter-map', {
      center: [8.953444, 125.525],
      zoom: 8,
      zoomControl: true
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.value)

    mapInstance.value.on('click', handleMapClick)
  } else {
    mapInstance.value.invalidateSize()
    if (selectedCoordinates.value) {
      mapInstance.value.setView([selectedCoordinates.value.lat, selectedCoordinates.value.lng], 12)
    }
  }
}

function handleMapClick(event) {
  const { lat, lng } = event.latlng
  selectedCoordinates.value = { lat, lng }
  form.latitude = lat.toFixed(6)
  form.longitude = lng.toFixed(6)

  if (mapMarker.value) {
    mapMarker.value.setLatLng([lat, lng])
  } else if (mapInstance.value) {
    mapMarker.value = L.marker([lat, lng]).addTo(mapInstance.value)
  }
}

function confirmMapSelection() {
  if (!selectedCoordinates.value) return
  hideMapPicker()
}

function hideMapPicker() {
  mapPickerVisible.value = false
}

function onShelterNameInput(event) {
  form.name = event.target.value
  console.log('Shelter name:', form.name)
}

function onAddressInput(event) {
  form.address = event.target.value
  console.log('Address:', form.address)
}

function onLatitudeInput(event) {
  form.latitude = event.target.value
  console.log('Latitude:', form.latitude)
}

function onLongitudeInput(event) {
  form.longitude = event.target.value
  console.log('Longitude:', form.longitude)
}

function onCapacityInput(event) {
  form.capacity = event.target.value
  console.log('Capacity:', form.capacity)
}

function onStatusChange(event) {
  form.status = event.target.value
  console.log('Status changed to:', form.status)
}

function onContactPersonInput(event) {
  form.contact_person = event.target.value
  console.log('Contact person:', form.contact_person)
}

function onContactNumberInput(event) {
  form.contact_number = event.target.value
  console.log('Contact number:', form.contact_number)
}

function onNotesInput(event) {
  form.notes = event.target.value
  console.log('Notes:', form.notes)
}
</script>

<style scoped>
.add-shelter-wrap{ background:#f5f7fa; min-height:100vh; padding:28px }
.page-head{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px }
.page-head h2{ margin:0; font-size:20px }
.page-head .desc{ color:#7a7f84; font-size:13px; margin:4px 0 0 }
.btn-refresh{ background:#fff; border:1px solid #e6e9ec; padding:8px 12px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:6px }
.btn-refresh svg{ width:16px; height:16px }

.form-modal{ display:flex; align-items:center; justify-content:center; min-height:calc(100vh - 100px) }
.modal-content{ background:#fff; padding:28px; border-radius:12px; width:100%; max-width:540px; box-shadow:0 14px 40px rgba(20,30,40,0.12) }
.modal-content h3{ margin:0 0 8px; font-size:18px }
.modal-desc{ color:#7a7f84; font-size:13px; margin:0 0 20px }

.shelter-form{ display:flex; flex-direction:column; gap:14px }
.form-row{ display:flex; gap:14px }
.form-row.two{ display:grid; grid-template-columns:1fr 1fr; gap:14px; align-items:flex-end }
.form-row.two button.map-btn{ width:44px; height:44px; border:1px solid #e6e9ec; background:#fff; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center }
.form-row.two button.map-btn svg{ width:20px; height:20px }

.form-group{ display:flex; flex-direction:column; gap:6px }
.form-group span{ font-weight:600; font-size:13px }
.form-group input, .form-group select, .form-group textarea{ padding:10px; border:1px solid #e6e9ec; border-radius:8px; font-family:inherit; font-size:14px }
.form-group textarea{ resize:vertical; min-height:100px }

.form-actions{ display:flex; gap:12px; justify-content:flex-end; margin-top:8px }
.btn-cancel{ background:#fff; border:1px solid #e6e9ec; padding:10px 16px; border-radius:8px; cursor:pointer }
.btn-save{ background:#ff6b1a; color:#fff; border:0; padding:10px 16px; border-radius:8px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px }
.btn-save:hover{ background:#ff5a00 }
.btn-save svg{ width:16px; height:16px }

.map-picker-overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px }
.map-picker-panel{ background:#fff; border-radius:16px; width:100%; max-width:640px; padding:24px; box-shadow:0 18px 40px rgba(15,23,42,0.25); display:flex; flex-direction:column; gap:10px }
.map-picker-panel header h4{ margin:0; font-size:18px }
.map-picker-panel header p{ margin:2px 0 0; font-size:13px; color:#6b7280 }
.shelter-map{ width:100%; height:320px; border-radius:12px; border:1px solid #e5e7eb }
.map-coords{ font-size:13px; color:#374151; margin:0 }
.map-picker-footer{ display:flex; justify-content:flex-end; gap:10px }

@media (max-width:480px){
  .form-row.two{ grid-template-columns:1fr }
  .form-row.two button.map-btn{ grid-column:auto }
  .modal-content{ padding:20px }
}
</style>
