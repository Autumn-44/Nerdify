function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className='flex gap-4 border-b border-gray-700 pb-3'>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 ${
            activeTab === tab
              ? 'border-b-2 border-green-500 text-green-500'
              : 'text-gray-400'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default Tabs