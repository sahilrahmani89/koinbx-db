
'use client';
import useHomePage from '../hooks/useHomePage';
import { KoinbxTable } from './common/koinbx-table';



const Dashboard = () => {
  const { activeTab,
    columns,
    hotList,
    newList,
    isLoading,
    setActiveTab,
  } = useHomePage()
  //
  return (
    <div className="mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-5">
        <button
          className={`px-4 py-2 ${activeTab === 'hotList' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('hotList')}
        >
          Hot List
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'newList' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('newList')}
        >
          New List
        </button>
      </div>

      {/* Content */}
      {activeTab === 'hotList' && (
        <div>

          {
            hotList.length > 0 ?
              <KoinbxTable
                title="Hot List"
                searchable={false}
                columns={columns}
                data={hotList}
                isLoading={isLoading}
              />
              : <div className='flex w-full justify-center item-center'>
                <div className='mt-5 px-2py-4'>
                  No Data  Found
                </div>
              </div>
          }


        </div>
      )}

      {activeTab === 'newList' && (
        <div>

          {
            newList?.length > 0 ?

              <KoinbxTable
                title="New List"
                searchable={false}
                columns={columns}
                data={newList}
                isLoading={isLoading}
              />
              : <div className='flex w-full justify-center item-center'>
                <div className='mt-5 px-2py-4'>
                  No Data  Found
                </div>
              </div>
          }


        </div>
      )}
    </div>
  );
};

export default Dashboard;
