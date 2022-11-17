import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../components/table/Table";
import DashboardHeading from "../dashboard/DashboardHeding";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector, useDispatch } from "react-redux";
import { getOrder, refresh } from "../../redux/order/orderSlice";
import { useEffect } from "react";
import { action_status } from "../../utils/constants/status";
import { format } from "date-fns";
import LoadingPage from "../../components/loading/LoadingPage";
import { useState } from "react";
import Pagination from "react-js-pagination";
import queryString from "query-string";

const UserOrder = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { status, totalPage } = useSelector((state) => state.order);
  const { current } = useSelector((state) => state.user);
  const { order, update } = useSelector((state) => state.order);

  const location = useLocation();
  const params = queryString.parse(location.search);
  const [state, setState] = useState(params.status);
  const [page, setPage] = useState(1);

  useEffect(() => {
    try {
      const data = {
        id: current._id,
        page: page,
        status: state,
        limit: 5,
      };
      dispatch(getOrder(data));
      dispatch(refresh());
      setState(params.status);
    } catch (error) {
      console.log(error.message);
    }
  }, [page, state, params.status, update]);

  const handleClick = (e) => {
    setState(e.target.value);
    navigate(`/account/orders?status=${e.target.value}`);
    setPage(1);
  };

  const handlePageClick = (values) => {
    setPage(values);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <DashboardHeading
          title="Quản lý đơn hàng"
          className="px-5 py-5"
        ></DashboardHeading>
        <div className="flex items-center gap-x-3">
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg border border-gray-300 ${
              state === "All" || state === undefined
                ? "bg-blue-500 text-white"
                : ""
            }`}
            value="All"
            onClick={handleClick}
          >
            Tất cả đơn hàng
          </button>
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg border border-gray-300 ${
              state === "Processed" ? "bg-blue-500 text-white" : ""
            }`}
            value="Processed"
            onClick={handleClick}
          >
            Đang xử lý
          </button>
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6  text-base font-medium rounded-lg border border-gray-300 ${
              state === "Success" ? "bg-blue-500 text-white" : ""
            }`}
            value="Success"
            onClick={handleClick}
          >
            Thành công
          </button>
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg border border-gray-300  ${
              state === "Cancelled" ? "bg-blue-500 text-white" : ""
            }`}
            value="Cancelled"
            onClick={handleClick}
          >
            Đã hủy đơn
          </button>
        </div>
      </div>

      {status === action_status.LOADING && <LoadingPage />}
      {status === action_status.SUCCEEDED && (
        <>
          <Table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày mua</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {(state === "All" || state === undefined) && (
                <>
                  {order?.length > 0 &&
                    order.map((item) => (
                      <tr className="text-lg" key={item._id}>
                        <td
                          className="cursor-pointer text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            navigate(`/account/orders/${item._id}`)
                          }
                          title={item._id}
                        >
                          {item._id.slice(0, 10)}
                        </td>
                        <td>
                          {format(new Date(item?.createdAt), "HH:mm")}
                          &nbsp;&nbsp;
                          {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td>{item.cart[0].product.title.slice(0, 50)}</td>
                        <td>{formatPrice(item.totalPrice)}</td>
                        {item?.status === "Processed" && (
                          <td>
                            <span className="p-2 rounded-lg text-white bg-orange-400">
                              Đang xử lý
                            </span>
                          </td>
                        )}
                        {item?.status === "Waiting Goods" && (
                          <td>
                            <span className="p-2 rounded-lg text-white bg-yellow-400">
                              Đợi lấy hàng
                            </span>
                          </td>
                        )}
                        {item?.status === "Cancelled" && (
                          <td>
                            <span className="p-2 rounded-lg text-white bg-red-400">
                              Đã hủy đơn
                            </span>
                          </td>
                        )}
                        {item?.status === "Success" && (
                          <td>
                            <span className="p-2 rounded-lg text-white  bg-green-400">
                              Thành công
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                </>
              )}
              {state === "Processed" && (
                <>
                  {order?.length > 0 &&
                    order.map((item) => (
                      <tr className="text-lg" key={item._id}>
                        <td
                          className="cursor-pointer text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            navigate(`/account/orders/${item._id}`)
                          }
                          title={item._id}
                        >
                          {item._id.slice(0, 10)}
                        </td>
                        <td>
                          {format(new Date(item?.createdAt), "HH:mm")}
                          &nbsp;&nbsp;
                          {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td>{item.cart[0].product.title.slice(0, 50)}</td>
                        <td>{formatPrice(item.totalPrice)}</td>
                        <td>
                          <span className="p-2 rounded-lg text-white bg-orange-400">
                            Đang xử lý
                          </span>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {state === "Cancelled" && (
                <>
                  {order?.length > 0 &&
                    order.map((item) => (
                      <tr className="text-lg" key={item._id}>
                        <td
                          className="cursor-pointer text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            navigate(`/account/orders/${item._id}`)
                          }
                          title={item._id}
                        >
                          {item._id.slice(0, 10)}
                        </td>
                        <td>
                          {format(new Date(item?.createdAt), "HH:mm")}
                          &nbsp;&nbsp;
                          {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td>{item.cart[0].product.title.slice(0, 50)}</td>
                        <td>{formatPrice(item.totalPrice)}</td>

                        <td>
                          <span className="p-2 rounded-lg text-white bg-red-400">
                            Đã hủy đơn
                          </span>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {state === "Success" && (
                <>
                  {order?.length > 0 &&
                    order.map((item) => (
                      <tr className="text-lg" key={item._id}>
                        <td
                          className="cursor-pointer text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            navigate(`/account/orders/${item._id}`)
                          }
                          title={item._id}
                        >
                          {item._id.slice(0, 10)}
                        </td>
                        <td>
                          {format(new Date(item?.createdAt), "HH:mm")}
                          &nbsp;&nbsp;
                          {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td>{item.cart[0].product.title.slice(0, 50)}</td>
                        <td>{formatPrice(item.totalPrice)}</td>

                        <td>
                          <span className="p-2 rounded-lg text-white  bg-green-400">
                            Thành công
                          </span>
                        </td>
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </Table>
          <div className="flex items-center justify-center mt-5">
            <Pagination
              activePage={page}
              nextPageText={">"}
              prevPageText={"<"}
              totalItemsCount={totalPage}
              itemsCountPerPage={1}
              firstPageText={"<<"}
              lastPageText={">>"}
              linkClass="page-num"
              onChange={handlePageClick}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserOrder;
