// src/stores/userStore.js
import { defineStore } from 'pinia'
import Fuse from 'fuse.js'
import { userService } from 'src/services/userService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [],
    search: '',
    searchResults: [],
    fuse: null,
    selectedUser: null,

    // diálogos
    showNewDialog: false,
    showEditDialog: false,
    showDetailDialog: false,
    showDeleteDialog: false,
    showPromoteDialog: false,
  }),

  getters: {
    totalUsers: (state) => state.users.length,

    activeUsersCount: (state) =>
      state.users.filter(u => u.state === 'active' || u.state === 'activo').length,

    inactiveUsersCount: (state) =>
      state.users.filter(u => u.state === 'inactive' || u.state === 'inactivo').length,

    adminUsersCount: (state) =>
      state.users.filter(u => u.tipo === 'ADMIN' || u.tipo === 'admin').length,

    dentistUsersCount: (state) =>
      state.users.filter(u => u.tipo === 'DENTIST' || u.tipo === 'dentist').length,

    clientUsersCount: (state) =>
      state.users.filter(u => u.tipo === 'CLIENT' || u.tipo === 'client').length,
  },

  actions: {
    // ---------- INIT ----------
    async initialize() {
      await this.fetchUsers()
      this.rebuildFuse()
    },

    // ---------- CRUD ----------
    async fetchUsers() {
      try {
        const { data } = await userService.getAll()
        this.users = data.data || []
        this.applySearch()
      } catch (error) {
        console.error('Error fetching users:', error)
        this.users = []
        this.applySearch()
        throw error
      }
    },

    async agregarUser(user) {
      try {
        const { data } = await userService.create(user)
        this.users.push(data.data)
        this.rebuildFuse()
        this.closeDialogs()
        return data.data
      } catch (error) {
        console.error('Error creating user:', error)
        throw error
      }
    },

    async actualizarUser(user) {
      try {
        if (!user || !user.id) {
          throw new Error('User ID is required')
        }
        const { data } = await userService.update(user.id, user)
        const idx = this.users.findIndex(u => u.id === user.id)
        if (idx !== -1) {
          this.users[idx] = data.data
        } else {
          this.users.push(data.data)
        }
        this.rebuildFuse()
        this.closeDialogs()
        return data.data
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      }
    },

    async eliminarUser() {
      try {
        if (!this.selectedUser || !this.selectedUser.id) {
          throw new Error('No user selected for deletion')
        }
        await userService.delete(this.selectedUser.id)
        this.users = this.users.filter(u => u.id !== this.selectedUser.id)
        this.rebuildFuse()
        this.closeDialogs()
        this.selectedUser = null
      } catch (error) {
        console.error('Error deleting user:', error)
        throw error
      }
    },

    async promocionarUser(id, promoteData) {
      try {
        if (!id) {
          throw new Error('User ID is required')
        }
        const { data } = await userService.promocionar(id, promoteData)
        const idx = this.users.findIndex(u => u.id === id)
        if (idx !== -1) {
          this.users[idx] = data.data
        }
        this.rebuildFuse()
        this.closeDialogs()
        return data.data
      } catch (error) {
        console.error('Error promoting user:', error)
        throw error
      }
    },

    // ---------- Search ----------
    rebuildFuse() {
      this.fuse = new Fuse(this.users, {
        keys: ['username', 'email', 'tipo'],
        threshold: 0.3
      })

      this.applySearch()
    },

    applySearch() {
      if (!this.search) {
        this.searchResults = [...this.users]
      } else {
        if (this.fuse) {
          this.searchResults = this.fuse.search(this.search).map(r => r.item)
        } else {
          this.searchResults = [...this.users]
        }
      }
    },

    // ---------- Dialogs ----------
    openNewDialog() { this.showNewDialog = true },
    openEditDialog(user) { 
      this.selectedUser = user
      this.showEditDialog = true 
    },
    openDetailDialog(user) { 
      this.selectedUser = user
      this.showDetailDialog = true 
    },
    openPromoteDialog(user) {
      this.selectedUser = user
      this.showPromoteDialog = true
    },
    confirmDeleteUser(user) {
      this.selectedUser = user
      this.showDeleteDialog = true
    },

    closeDialogs() {
      this.showNewDialog = false
      this.showEditDialog = false
      this.showDetailDialog = false
      this.showDeleteDialog = false
      this.showPromoteDialog = false
    },

    closeDeleteDialog() { this.showDeleteDialog = false },
    closePromoteDialog() { this.showPromoteDialog = false },

    // ---------- Utils ----------
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    formatState(state) {
      const states = {
        'active': 'Activo',
        'activo': 'Activo',
        'inactive': 'Inactivo',
        'inactivo': 'Inactivo'
      }
      return states[state] || state
    },

    formatType(type) {
      const types = {
        'ADMIN': 'Administrador',
        'admin': 'Administrador',
        'DENTIST': 'Dentista',
        'dentist': 'Dentista',
        'CLIENT': 'Cliente',
        'client': 'Cliente'
      }
      return types[type] || type
    },

    getStateClass(state) {
      return (state === 'active' || state === 'activo') ? 'active' : 'inactive'
    },

    getTypeClass(type) {
      const upperType = (type || '').toUpperCase()
      const classes = {
        'ADMIN': 'admin',
        'DENTIST': 'dentist',
        'CLIENT': 'client'
      }
      return classes[upperType] || 'default'
    },

    getTypeIcon(type) {
      const upperType = (type || '').toUpperCase()
      const icons = {
        'ADMIN': 'fa-solid fa-user-shield',
        'DENTIST': 'fa-solid fa-user-doctor',
        'CLIENT': 'fa-solid fa-user'
      }
      return icons[upperType] || 'fa-solid fa-user'
    },

    handleImageError(e) {
      e.target.src = '/default-avatar.png'
    },

    getAvatarColor(username) {
      if (!username) return '#9e9e9e'
      
      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
      ]
      
      let hash = 0
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      return colors[Math.abs(hash) % colors.length]
    },

    getInitials(name) {
      if (!name) return '?'
      
      const words = name.trim().split(' ')
      
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase()
      }
      
      return (words[0][0] + (words[1]?.[0] || '')).toUpperCase()
    }
  }
})