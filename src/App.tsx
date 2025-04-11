import {Routes as Router, Route, BrowserRouter} from 'react-router-dom';
import NotFound from './pages/_auth/_not-found';
// Layouts
import MainLayout from './components/appLayout/main-layout';
// Authentication
import AuthenticationPage from './pages/_auth/login';
// Admin
import {
	DashboardPage,
	EmployeeCreatePage,
	EmployeeUpdatePage,
	EmployeeViewPage,
} from './pages/admin';

import {SalesPosPage, SalesListPage} from './pages/sales';

// TODO: Sort this to each index found in root of page file index.ts
import {CreateSalesPage} from './pages/sales/systems/sales/sales-create-page';
import ViewServicePage from './pages/sales/systems/service/view-service-page';
import CustomerCreatePage from './pages/customer/customer-create-page';
import CustomerViewPage from './pages/customer/customer-view-page';
import Settings from './pages/general/settings';
import Terminal from './pages/general/terminal';
import RequireAuth from './modules/authentication/auth-layout';
import Unauthorized from './pages/_auth/unauthorized';
import EmployeePage from './pages/admin/systems/ems/employee-page';
import ProductPage from './pages/inventory/product/prouct-page';
import InventoryViewPage from './pages/inventory/product/inventory-view-page';
import CreateProductPage from './pages/inventory/product/product-create-page';
import OrderPage from './pages/inventory/order/orders-page';
import SupplierPage from './pages/inventory/suppliers/supplier-page';
import CreateOrderPage from './pages/inventory/order/create-order-page';
import InventoryRecordCreatePage from './pages/inventory/product/inventoryView/inventory-record-create';
import CustomerDatabasePage from './pages/customer/customer-page';
import ViewOrderPage from './pages/inventory/order/order-view-page';
import SalesViewPage from './pages/sales/systems/sales/sales-view-page';
import PaymentListPage from './pages/payment/system/payment-list-page';
import ServiceListPage from './pages/sales/systems/service/service-list-page';
import CreateServicePage from './pages/sales/systems/service/create-service-page';

function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index path="/" element={<AuthenticationPage />} />
				<Route path="*" element={<NotFound />} />
				<Route path="unauthorized" element={<Unauthorized />} />

				{/* Admin Layout */}
				<Route path="admin" element={<MainLayout userType={'admin'} />}>
					<Route element={<RequireAuth allowedRoles={['Admin']} />}>
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="settings" element={<Settings />} />
						{/* <Route path="terminal" element={<Terminal />} /> */}

						<Route path="ems">
							<Route path="employees">
								<Route index element={<EmployeePage />} />
								<Route path="create" element={<EmployeeCreatePage />} />
								<Route path="update" element={<EmployeeUpdatePage />} />
								<Route path="view/:id" element={<EmployeeViewPage />} />
							</Route>
						</Route>

						{/* Customer */}
						<Route path="customer" element={<CustomerDatabasePage />} />
						<Route path="customer/view/:id" element={<CustomerViewPage />} />
						<Route path="customer/create" element={<CustomerCreatePage />} />

						<Route path="sales/system">
							<Route path="create" element={<CreateSalesPage />} />
							<Route path="list" element={<SalesListPage />} />
							<Route path="services" element={<ServiceListPage />} />
							<Route path="services/view/:id" element={<ViewServicePage />} />
							<Route path="services/create" />
							<Route path="payment" />
						</Route>

						<Route path="inventory">
							<Route path="products">
								<Route index element={<ProductPage />} />
								<Route path="create" element={<CreateProductPage />} />
								<Route path="view/:id">
									<Route index element={<InventoryViewPage />} />
									<Route
										path="create"
										element={<InventoryRecordCreatePage />}
									/>

									<Route path="orders">
										<Route index element={<OrderPage />} />
										<Route path="create" element={<CreateOrderPage />} />
										<Route path="view/:id" />
									</Route>
								</Route>
							</Route>
							<Route path="orders">
								<Route index element={<OrderPage />} />
								<Route path="create" element={<CreateOrderPage />} />
								<Route path="view/:id" element={<ViewOrderPage />} />
								<Route
									path="view/product/:id"
									element={<InventoryViewPage />}
								/>
							</Route>
							<Route path="suppliers">
								<Route index element={<SupplierPage />} />
								<Route path="view/:id" />
							</Route>
						</Route>
					</Route>
				</Route>

				{/* Technical Layout */}
				<Route path="tech" element={<MainLayout userType={'tech'} />}>
					<Route element={<RequireAuth allowedRoles={['Technician']} />}>
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="settings" element={<Settings />} />
						<Route path="terminal" element={<Terminal />} />

						{/* Systems */}
						<Route path="services"></Route>

						<Route path="customer">
							<Route index element={<CustomerDatabasePage />} />
							<Route path="view/:customer_id" element={<CustomerViewPage />} />
							<Route path="create" element={<CustomerCreatePage />} />
						</Route>

						<Route path="inventory">
							<Route path="products">
								<Route index element={<ProductPage />} />
								<Route path="create" element={<CreateProductPage />} />
								<Route path="view/:id">
									<Route index element={<InventoryViewPage />} />
									<Route
										path="create"
										element={<InventoryRecordCreatePage />}
									/>

									<Route path="orders">
										<Route index element={<OrderPage />} />
										<Route path="create" element={<CreateOrderPage />} />
										<Route path="view/:id" />
									</Route>
								</Route>

								<Route path="orders">
									<Route index element={<OrderPage />} />
									<Route path="create" element={<CreateOrderPage />} />
									<Route path="view/:id" />
									<Route
										path="view/product/:id"
										element={<InventoryViewPage />}
									/>
								</Route>
								<Route path="suppliers">
									<Route index element={<SupplierPage />} />
									<Route path="view/:id" />
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>

				{/* Sales Layout */}
				<Route path="sales" element={<MainLayout userType={'sales'} />}>
					<Route element={<RequireAuth allowedRoles={['Sales']} />}>
						<Route path="dashboard" element={<SalesPosPage />} />
						<Route path="settings" element={<Settings />} />

						{/* Systems */}
						{/* Sales list */}
						<Route path="system">
							<Route path="create" element={<CreateSalesPage />} />
							<Route path="list" element={<SalesListPage />} />
							<Route path="list/view/:id" element={<SalesViewPage />} />
							<Route path="services" element={<ServiceListPage />} />
							<Route path="services/view/:id" element={<ViewServicePage />} />
							<Route path="services/create" element={<CreateServicePage />} />
							<Route path="payment" element={<PaymentListPage />} />

							{/* Customer */}
							<Route path="customer" element={<CustomerDatabasePage />} />
							<Route path="customer/view/:id" element={<CustomerViewPage />} />
							<Route path="customer/create" element={<CustomerCreatePage />} />

							{/* Inventory */}
							<Route path="inventory">
								<Route path="products">
									<Route index element={<ProductPage />} />
									<Route path="create" element={<CreateProductPage />} />
									<Route path="view/:id">
										<Route index element={<InventoryViewPage />} />
										<Route
											path="create"
											element={<InventoryRecordCreatePage />}
										/>

										<Route path="orders">
											<Route index element={<OrderPage />} />
											<Route path="create" element={<CreateOrderPage />} />
											<Route path="view/:id" />
										</Route>
									</Route>
								</Route>
								<Route path="orders">
									<Route index element={<OrderPage />} />
									<Route path="create" element={<CreateOrderPage />} />
									<Route path="view/:id" element={<ViewOrderPage />} />
									<Route
										path="view/product/:id"
										element={<InventoryViewPage />}
									/>
								</Route>
								<Route path="suppliers">
									<Route index element={<SupplierPage />} />
									<Route path="view/:id" />
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
			</Router>
		</BrowserRouter>
	);
}

export default App;
