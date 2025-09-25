import { DashboardWidget } from '@sanity/dashboard'
import { SchemaWidget } from './SchemaWidget'

export function schemaDashboardWidget(): DashboardWidget {
  return {
    name: 'schema-dashboard',
    component: SchemaWidget,
    layout: { width: 'medium', height: 'large' }
  }
}