import { ref } from 'vue'

const defaultShelters = [
  {
    id: 1,
    name: 'Butuan City Multipurpose Hall',
    shelter_type: 'Multipurpose Center',
    address: 'Butuan City, Agusan del Norte',
    region: 'Agusan del Norte',
    status: 'active',
    max_capacity: 500,
    current_occupancy: 320,
    latitude: '8.9483',
    longitude: '125.5401',
    contact_person: 'Maya Santos',
    contact_number: '+63-85-225-0000',
    notes: 'Main assembly point for Butuan City'
  },
  {
    id: 2,
    name: 'Surigao City Convention Center',
    shelter_type: 'Convention Center',
    address: 'Surigao City, Surigao del Norte',
    region: 'Surigao del Norte',
    status: 'active',
    max_capacity: 420,
    current_occupancy: 410,
    latitude: '9.7900',
    longitude: '125.4950',
    contact_person: 'Ramon dela Cruz',
    contact_number: '+63-86-236-0042',
    notes: 'New kitchen built for relief operations'
  },
  {
    id: 3,
    name: 'Tandag Multipurpose Center',
    shelter_type: 'Multipurpose Center',
    address: 'Tandag City, Surigao del Sur',
    region: 'Surigao del Sur',
    status: 'active',
    max_capacity: 360,
    current_occupancy: 285,
    latitude: '9.1478',
    longitude: '126.1977',
    contact_person: 'Sonia Villanueva',
    contact_number: '+63-86-211-5678',
    notes: 'Supports barangay evacuation plans'
  },
  {
    id: 4,
    name: 'Cabadbaran Evacuation Center',
    shelter_type: 'Evacuation Center',
    address: 'Cabadbaran City, Agusan del Norte',
    region: 'Agusan del Norte',
    status: 'full',
    max_capacity: 280,
    current_occupancy: 280,
    latitude: '9.0733',
    longitude: '125.4871',
    contact_person: 'Imelda Rosales',
    contact_number: '+63-85-222-1105',
    notes: 'Full capacity, on standby for relief resupply'
  },
  {
    id: 5,
    name: 'Bislig Community Center',
    shelter_type: 'Community Center',
    address: 'Bislig City, Surigao del Sur',
    region: 'Surigao del Sur',
    status: 'inactive',
    max_capacity: 220,
    current_occupancy: 60,
    latitude: '8.0605',
    longitude: '126.4040',
    contact_person: 'Marco Reyes',
    contact_number: '+63-86-710-2211',
    notes: 'Maintains standby emergency staff'
  }
]

const shelters = ref(defaultShelters.map((shelter) => ({ ...shelter })))

function addShelter(entry) {
  const newShelter = {
    id: Date.now(),
    name: entry.name,
    shelter_type: entry.shelter_type || 'Multipurpose Center',
    address: entry.address,
    region: entry.region || 'Caraga Region',
    status: entry.status?.toLowerCase() || 'inactive',
    max_capacity: Number(entry.capacity) || Number(entry.max_capacity) || 0,
    current_occupancy: Number(entry.current_occupancy) || 0,
    latitude: entry.latitude || '',
    longitude: entry.longitude || '',
    contact_person: entry.contact_person || '',
    contact_number: entry.contact_number || '',
    notes: entry.notes || ''
  }

  shelters.value = [newShelter, ...shelters.value]
  return newShelter
}

function updateShelter(id, payload) {
  shelters.value = shelters.value.map((shelter) => {
    if (shelter.id === id) {
      return {
        ...shelter,
        ...payload,
        max_capacity: Number(payload.max_capacity || shelter.max_capacity),
        current_occupancy: Number(payload.current_occupancy || shelter.current_occupancy)
      }
    }
    return shelter
  })
}

function resetShelters() {
  shelters.value = defaultShelters.map((shelter) => ({ ...shelter }))
}

export { shelters, addShelter, updateShelter, resetShelters, defaultShelters }
