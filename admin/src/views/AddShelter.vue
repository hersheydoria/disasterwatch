<template>
  <div class="add-shelter-wrap">
    <header class="page-head">
      <div>
        <h2>Evacuation Shelters</h2>
        <p class="desc">Manage evacuation areas and shelter information</p>
      </div>
      <button class="btn-refresh">🔄 Refresh Data</button>
    </header>

    <div class="form-modal">
      <div class="modal-content">
        <h3>Add New Shelter</h3>
        <p class="modal-desc">Provide accurate details for the evacuation shelter.</p>

        <form @submit.prevent="submit" class="shelter-form">
          <div class="form-row">
            <label class="form-group">
              <span>Shelter Name*</span>
              <input v-model="form.name" placeholder="Enter shelter name" />
            </label>
          </div>

          <div class="form-row">
            <label class="form-group">
              <span>Address / Location*</span>
              <input v-model="form.address" placeholder="Enter complete address" />
            </label>
          </div>

          <div class="form-row two">
            <label class="form-group">
              <span>Coordinates</span>
              <input v-model="form.latitude" placeholder="Latitude" />
            </label>
            <label class="form-group">
              <input v-model="form.longitude" placeholder="Longitude" />
            </label>
            <button type="button" class="map-btn">📍</button>
          </div>

          <div class="form-row two">
            <label class="form-group">
              <span>Capacity*</span>
              <input v-model="form.capacity" type="number" placeholder="0" />
            </label>
            <label class="form-group">
              <span>Status*</span>
              <select v-model="form.status">
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
              <input v-model="form.contact_person" placeholder="Enter contact person name" />
            </label>
            <label class="form-group">
              <span>Contact Number*</span>
              <input v-model="form.contact_number" placeholder="Enter contact number" />
            </label>
          </div>

          <div class="form-row">
            <label class="form-group">
              <span>Additional Notes</span>
              <textarea v-model="form.notes" placeholder="Enter any additional information about the shelter."></textarea>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="cancel">Cancel</button>
            <button type="submit" class="btn-save">💾 Save Shelter</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['cancel'])
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

function submit() {
  // TODO: submit to API
  console.log('Submitting shelter:', form)
  alert('Shelter saved! (Demo)')
  navigate('shelters')
}

function cancel() {
  navigate('shelters')
}
</script>

<style scoped>
.add-shelter-wrap{ background:#f5f7fa; min-height:100vh; padding:28px }
.page-head{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px }
.page-head h2{ margin:0; font-size:20px }
.page-head .desc{ color:#7a7f84; font-size:13px; margin:4px 0 0 }
.btn-refresh{ background:#fff; border:1px solid #e6e9ec; padding:8px 12px; border-radius:8px; cursor:pointer }

.form-modal{ display:flex; align-items:center; justify-content:center; min-height:calc(100vh - 100px) }
.modal-content{ background:#fff; padding:28px; border-radius:12px; width:100%; max-width:540px; box-shadow:0 14px 40px rgba(20,30,40,0.12) }
.modal-content h3{ margin:0 0 8px; font-size:18px }
.modal-desc{ color:#7a7f84; font-size:13px; margin:0 0 20px }

.shelter-form{ display:flex; flex-direction:column; gap:14px }
.form-row{ display:flex; gap:14px }
.form-row.two{ display:grid; grid-template-columns:1fr 1fr; gap:14px }
.form-row.two button.map-btn{ grid-column:3; align-self:flex-end; width:44px; height:44px; border:1px solid #e6e9ec; background:#fff; border-radius:8px; cursor:pointer }

.form-group{ display:flex; flex-direction:column; gap:6px }
.form-group span{ font-weight:600; font-size:13px }
.form-group input, .form-group select, .form-group textarea{ padding:10px; border:1px solid #e6e9ec; border-radius:8px; font-family:inherit; font-size:14px }
.form-group textarea{ resize:vertical; min-height:100px }

.form-actions{ display:flex; gap:12px; justify-content:flex-end; margin-top:8px }
.btn-cancel{ background:#fff; border:1px solid #e6e9ec; padding:10px 16px; border-radius:8px; cursor:pointer }
.btn-save{ background:#ff6b1a; color:#fff; border:0; padding:10px 16px; border-radius:8px; font-weight:600; cursor:pointer }
.btn-save:hover{ background:#ff5a00 }

@media (max-width:480px){
  .form-row.two{ grid-template-columns:1fr }
  .form-row.two button.map-btn{ grid-column:auto }
  .modal-content{ padding:20px }
}
</style>
