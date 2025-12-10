function TabNavigation({tabs=[], activeTab, setActiveTab, isTabsNotTittle=false}) {
    return (
        <>
            {!isTabsNotTittle ? (
                <div className="border-b">
                    <div className={`flex space-x-6`}>
                        {tabs?.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative text-sm font-medium transition-colors duration-200 "text-black`}
                                >
                                <p className={`${activeTab === tab && "border-b-2 border-blue-600"}`}>
                                    {tab}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            ): (
                <div className="border-b h-full flex items-center justify-center">
                    <div className="flex space-x-6 h-full">
                        {tabs?.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative text-lg font-medium transition-colors duration-200 text-black`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute left-0 -bottom-0.5 h-1 w-full rounded-sm" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default TabNavigation;
  