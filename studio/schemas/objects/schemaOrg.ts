// 💥 デバッグ版: 最小限のschemaOrg設定
console.log('🔥 schemaOrg.ts loading...')

const schemaOrgObject = {
  name: 'schemaOrg',
  type: 'object',
  title: 'Schema.org設定',
  fields: [
    {
      name: 'enabled',
      type: 'boolean',
      title: '🔍 Schema.org構造化データを有効化',
      initialValue: false
    }
  ]
}

console.log('✅ schemaOrg object created:', schemaOrgObject)

export default schemaOrgObject