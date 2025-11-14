const translations = {
  notifications: {
    user: {
      title: 'Mis Notificaciones',
      empty: 'No tienes notificaciones',
      mark_all_read: 'Marcar todas como leídas',
      booking_confirmed: 'Tu reserva ha sido confirmada',
      booking_cancelled: 'Tu reserva ha sido cancelada',
      booking_reminder: 'Recordatorio de tu próxima reserva',
      payment_success: 'Pago realizado con éxito',
      payment_failed: 'Error en el pago',
      reward_earned: 'Has ganado puntos de recompensa',
      review_reminder: 'No olvides dejar tu reseña',
      profile_update: 'Perfil actualizado correctamente'
    },
    vendor: {
      title: 'Notificaciones del Proveedor',
      empty: 'No hay notificaciones',
      mark_all_read: 'Marcar todas como leídas',
      new_booking: 'Nueva reserva recibida',
      booking_cancelled: 'Reserva cancelada',
      payment_received: 'Pago recibido',
      new_review: 'Nueva reseña recibida',
      vehicle_approval: 'Vehículo aprobado',
      vehicle_rejection: 'Vehículo rechazado',
      maintenance_reminder: 'Recordatorio de mantenimiento',
      document_expiring: 'Documentos próximos a vencer'
    },
    admin: {
      title: 'Notificaciones del Administrador',
      empty: 'No hay notificaciones',
      mark_all_read: 'Marcar todas como leídas',
      new_vendor: 'Nuevo proveedor registrado',
      vendor_verification: 'Verificación de proveedor pendiente',
      reported_review: 'Reseña reportada',
      system_alert: 'Alerta del sistema',
      high_traffic: 'Alto tráfico detectado',
      payment_issue: 'Problema con pagos detectado',
      security_alert: 'Alerta de seguridad',
      support_escalation: 'Escalamiento de soporte'
    }
  },
  admin: {
    analytics: {
      title: 'Panel de Analíticas',
      subtitle: 'Visualiza y analiza el rendimiento de la plataforma',
      date_range: 'Rango de Fechas',
      last_7_days: 'Últimos 7 días',
      last_30_days: 'Últimos 30 días',
      last_90_days: 'Últimos 90 días',
      last_year: 'Último año',
      export: 'Exportar Datos',
      user_growth: 'Crecimiento de Usuarios',
      revenue_trend: 'Tendencia de Ingresos',
      bookings_by_type: 'Reservas por Tipo',
      platform_metrics: 'Métricas de la Plataforma',
      rewards_usage: 'Uso de Recompensas',
      support_analysis: 'Análisis de Soporte',
      chart_placeholder: 'Cargando gráfico...',
      export_title: 'Exportar Analíticas',
      export_coming_soon: 'La exportación estará disponible próximamente',
      error_title: 'Error de Analíticas',
      load_error: 'Error al cargar los datos analíticos',
      total_users: 'Total de Usuarios',
      revenue: 'Ingresos',
      active_users: 'Usuarios Activos',
      bookings: 'Reservas',
      reviews: 'Reseñas',
      points_earned: 'Puntos Ganados',
      points_redeemed: 'Puntos Canjeados',
      tickets_opened: 'Tickets Abiertos',
      tickets_resolved: 'Tickets Resueltos'
    },
    bookings: {
      title: 'Gestión de Reservas',
      total: 'Total Reservas',
      confirmed: 'Confirmadas',
      pending: 'Pendientes',
      disputed: 'En Disputa',
      total_revenue: 'Ingresos Totales',
      search_placeholder: 'Buscar por cliente, vehículo o ID...',
      booking_status: 'Estado',
      all_statuses: 'Todos los Estados',
      payment_status: 'Estado de Pago',
      all_payment_statuses: 'Todos los Estados de Pago',
      disputes: 'Disputas',
      all_disputes: 'Todas las Disputas',
      date_range: 'Rango de Fechas',
      all_dates: 'Todas las Fechas',
      clear_filters: 'Limpiar Filtros',
      showing_results: 'Mostrando {start} a {end} de {total}',
      list_title: 'Lista de Reservas',
      booking_id: 'ID de Reserva',
      client: 'Cliente',
      vehicle: 'Vehículo',
      dates: 'Fechas',
      status_label: 'Estado',
      total_cost: 'Costo Total',
      actions: 'Acciones',
      pagination: {
        previous: 'Anterior',
        next: 'Siguiente',
        page_of: 'Página {current} de {total}'
      }
    },
    manage_vendors: {
      title: 'Gestión de Proveedores',
      total_vendors: 'Total de Proveedores',
      verified: 'Verificados',
      pending: 'Pendientes',
      manage: 'Gestionar',
      subtitle: 'Administra los proveedores de la plataforma',
      bookings: {
        total: 'Total de Reservas',
        verified: 'Reservas Verificadas',
        pending: 'Reservas Pendientes'
      }
    }
  }
}

export default translations
