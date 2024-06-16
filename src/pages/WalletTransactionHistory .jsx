import { useQuery } from "@tanstack/react-query";
import { getWalletTransaction } from "../services/Wallet/walletAPI";

const WalletTransactionHistory = () => {
  
  // <-------- Get All Categories -------->
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allTransaction"],
    queryFn: async () => {
      const data = await getWalletTransaction();
      console.log(data);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isSuccess) {
    console.log("isSuccess", data);
  }

  return (
    <div className=" min-h-screen bg-gray-50 py-5">
      <div className="px-5">
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-600">
            Transaction History.
          </h1>
        </div>
      </div>
      <div className="flex flex-col  m-8">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-1/10"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 w-2/10"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {isSuccess &&
                    data.map((item, index) => (
                      <tr
                        className={`${
                          item.type === "purchase"
                            ? "bg-red-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "bg-slate-50 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        key={index}
                      >
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {item.userId.firstName} {item.userId.lastName}
                            </div>
                          </div>
                        </td>

                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {item.type}
                            </div>
                          </div>
                        </td>
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {item.amount}
                            </div>
                          </div>
                        </td>
                        <td className=" p-4  space-x-6 whitespace-nowrap">
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {item.timestamp}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionHistory;
