document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    let medicines = [
        { id: 1, code: 'TH001', name: 'Paracetamol', type: 'fever', unit: 'Viên', quantity: 150, importPrice: 500, salePrice: 1000, expiry: '2024-12-31' },
        { id: 2, code: 'TH002', name: 'Amoxicillin', type: 'antibiotic', unit: 'Viên', quantity: 80, importPrice: 800, salePrice: 1500, expiry: '2024-10-15' },
        { id: 3, code: 'TH003', name: 'Vitamin C', type: 'vitamin', unit: 'Lọ', quantity: 30, importPrice: 20000, salePrice: 35000, expiry: '2025-05-20' },
        { id: 4, code: 'TH004', name: 'Cefixime', type: 'antibiotic', unit: 'Viên', quantity: 5, importPrice: 1200, salePrice: 2500, expiry: '2024-08-30' },
        { id: 5, code: 'TH005', name: 'Panadol Extra', type: 'painkiller', unit: 'Viên', quantity: 200, importPrice: 700, salePrice: 1200, expiry: '2025-03-15' }
    ];

    let customers = [
        { id: 1, name: 'Nguyễn Văn A', phone: '0912345678', address: '123 Đường ABC, Quận 1, TP.HCM', dob: '1985-05-15' },
        { id: 2, name: 'Trần Thị B', phone: '0987654321', address: '456 Đường XYZ, Quận 3, TP.HCM', dob: '1990-10-20' },
        { id: 3, name: 'Lê Văn C', phone: '0909123456', address: '789 Đường DEF, Quận 5, TP.HCM', dob: '1978-03-25' }
    ];

    let suppliers = [
        { id: 1, name: 'Công ty Dược phẩm A', phone: '02838223344', address: '111 Đường Dược, Quận 10, TP.HCM', products: 'Kháng sinh, giảm đau' },
        { id: 2, name: 'Công ty Dược phẩm B', phone: '02839998877', address: '222 Đường Thuốc, Quận Tân Bình, TP.HCM', products: 'Vitamin, thực phẩm chức năng' }
    ];

    let sales = [
        { id: 1, customerId: 1, date: '2023-06-01', total: 150000, items: [
            { medicineId: 1, name: 'Paracetamol', quantity: 10, price: 1000, total: 10000 },
            { medicineId: 2, name: 'Amoxicillin', quantity: 5, price: 1500, total: 7500 }
        ]},
        { id: 2, customerId: 2, date: '2023-06-02', total: 35000, items: [
            { medicineId: 3, name: 'Vitamin C', quantity: 1, price: 35000, total: 35000 }
        ]}
    ];

    let activities = [
        { id: 1, type: 'sale', description: 'Bán đơn hàng #2 cho Trần Thị B', date: '2023-06-02 14:30' },
        { id: 2, type: 'sale', description: 'Bán đơn hàng #1 cho Nguyễn Văn A', date: '2023-06-01 10:15' },
        { id: 3, type: 'import', description: 'Nhập kho 50 Paracetamol', date: '2023-05-30 08:45' }
    ];

    // Navigation between sections
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Initialize dashboard
    function initDashboard() {
        document.getElementById('total-medicines').textContent = medicines.length;
        document.getElementById('total-customers').textContent = customers.length;
        
        // Calculate today's sales (for demo, we'll just sum all sales)
        const todaySales = sales.reduce((total, sale) => total + sale.total, 0);
        document.getElementById('today-sales').textContent = todaySales.toLocaleString() + ' đ';
        
        // Count medicines with low stock (quantity < 10)
        const lowStockCount = medicines.filter(med => med.quantity < 10).length;
        document.getElementById('low-stock').textContent = lowStockCount;
        
        // Display recent activities
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';
        activities.slice(0, 5).forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${activity.description}</span>
                <small>${activity.date}</small>
            `;
            activityList.appendChild(li);
        });
    }

    // Initialize medicines management
    function initMedicines() {
        const medicinesTable = document.getElementById('medicines-table').getElementsByTagName('tbody')[0];
        
        function renderMedicines() {
            medicinesTable.innerHTML = '';
            medicines.forEach(medicine => {
                const row = medicinesTable.insertRow();
                row.innerHTML = `
                    <td>${medicine.code}</td>
                    <td>${medicine.name}</td>
                    <td>${getMedicineTypeName(medicine.type)}</td>
                    <td>${medicine.unit}</td>
                    <td class="${medicine.quantity < 10 ? 'text-danger' : ''}">${medicine.quantity}</td>
                    <td>${medicine.importPrice.toLocaleString()}</td>
                    <td>${medicine.salePrice.toLocaleString()}</td>
                    <td>${formatDate(medicine.expiry)}</td>
                    <td>
                        <button class="btn-edit" data-id="${medicine.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger" data-id="${medicine.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        }
        
        // Add medicine button
        document.getElementById('add-medicine-btn').addEventListener('click', function() {
            openMedicineModal();
        });
        
        // Edit and delete buttons
        medicinesTable.addEventListener('click', function(e) {
            if (e.target.closest('.btn-edit')) {
                const medicineId = parseInt(e.target.closest('.btn-edit').getAttribute('data-id'));
                const medicine = medicines.find(m => m.id === medicineId);
                openMedicineModal(medicine);
            }
            
            if (e.target.closest('.btn-danger')) {
                const medicineId = parseInt(e.target.closest('.btn-danger').getAttribute('data-id'));
                if (confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
                    medicines = medicines.filter(m => m.id !== medicineId);
                    renderMedicines();
                    initDashboard(); // Update dashboard
                    showNotification('Đã xóa thuốc thành công!');
                }
            }
        });
        
        // Search functionality
        document.querySelector('#medicine-search + .btn-search').addEventListener('click', function() {
            const searchTerm = document.getElementById('medicine-search').value.toLowerCase();
            const filtered = medicines.filter(med => 
                med.code.toLowerCase().includes(searchTerm) || 
                med.name.toLowerCase().includes(searchTerm) ||
                getMedicineTypeName(med.type).toLowerCase().includes(searchTerm)
            );
            
            medicinesTable.innerHTML = '';
            filtered.forEach(medicine => {
                const row = medicinesTable.insertRow();
                row.innerHTML = `
                    <td>${medicine.code}</td>
                    <td>${medicine.name}</td>
                    <td>${getMedicineTypeName(medicine.type)}</td>
                    <td>${medicine.unit}</td>
                    <td class="${medicine.quantity < 10 ? 'text-danger' : ''}">${medicine.quantity}</td>
                    <td>${medicine.importPrice.toLocaleString()}</td>
                    <td>${medicine.salePrice.toLocaleString()}</td>
                    <td>${formatDate(medicine.expiry)}</td>
                    <td>
                        <button class="btn-edit" data-id="${medicine.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger" data-id="${medicine.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        });
        
        renderMedicines();
    }

    // Initialize customers management
    function initCustomers() {
        const customersTable = document.getElementById('customers-table').getElementsByTagName('tbody')[0];
        
        function renderCustomers() {
            customersTable.innerHTML = '';
            customers.forEach(customer => {
                const row = customersTable.insertRow();
                row.innerHTML = `
                    <td>KH${customer.id.toString().padStart(3, '0')}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td>${customer.dob ? formatDate(customer.dob) : 'N/A'}</td>
                    <td>
                        <button class="btn-edit" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger" data-id="${customer.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        }
        
        // Add customer button
        document.getElementById('add-customer-btn').addEventListener('click', function() {
            openCustomerModal();
        });
        
        // Edit and delete buttons
        customersTable.addEventListener('click', function(e) {
            if (e.target.closest('.btn-edit')) {
                const customerId = parseInt(e.target.closest('.btn-edit').getAttribute('data-id'));
                const customer = customers.find(c => c.id === customerId);
                openCustomerModal(customer);
            }
            
            if (e.target.closest('.btn-danger')) {
                const customerId = parseInt(e.target.closest('.btn-danger').getAttribute('data-id'));
                if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
                    customers = customers.filter(c => c.id !== customerId);
                    renderCustomers();
                    initDashboard(); // Update dashboard
                    showNotification('Đã xóa khách hàng thành công!');
                }
            }
        });
        
        // Search functionality
        document.querySelector('#customer-search + .btn-search').addEventListener('click', function() {
            const searchTerm = document.getElementById('customer-search').value.toLowerCase();
            const filtered = customers.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm) || 
                customer.phone.includes(searchTerm)
            );
            
            customersTable.innerHTML = '';
            filtered.forEach(customer => {
                const row = customersTable.insertRow();
                row.innerHTML = `
                    <td>KH${customer.id.toString().padStart(3, '0')}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.address}</td>
                    <td>${customer.dob ? formatDate(customer.dob) : 'N/A'}</td>
                    <td>
                        <button class="btn-edit" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger" data-id="${customer.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        });
        
        renderCustomers();
    }

    // Initialize suppliers management
    function initSuppliers() {
        const suppliersTable = document.getElementById('suppliers-table').getElementsByTagName('tbody')[0];
        
        function renderSuppliers() {
            suppliersTable.innerHTML = '';
            suppliers.forEach(supplier => {
                const row = suppliersTable.insertRow();
                row.innerHTML = `
                    <td>NCC${supplier.id.toString().padStart(3, '0')}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.phone}</td>
                    <td>${supplier.address}</td>
                    <td>${supplier.products}</td>
                    <td>
                        <button class="btn-edit" data-id="${supplier.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger" data-id="${supplier.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        }
        
        // Add supplier button
        document.getElementById('add-supplier-btn').addEventListener('click', function() {
            openSupplierModal();
        });
        
        // Edit and delete buttons
        suppliersTable.addEventListener('click', function(e) {
            if (e.target.closest('.btn-edit')) {
                const supplierId = parseInt(e.target.closest('.btn-edit').getAttribute('data-id'));
                const supplier = suppliers.find(s => s.id === supplierId);
                openSupplierModal(supplier);
            }
            
            if (e.target.closest('.btn-danger')) {
                const supplierId = parseInt(e.target.closest('.btn-danger').getAttribute('data-id'));
                if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
                    suppliers = suppliers.filter(s => s.id !== supplierId);
                    renderSuppliers();
                    showNotification('Đã xóa nhà cung cấp thành công!');
                }
            }
        });
        
        // Search functionality
        document.querySelector('#supplier-search + .btn-search').addEventListener('click', function() {
            const searchTerm = document.getElementById('supplier-search').value.toLowerCase();
            const filtered = suppliers.filter(supplier => 
                supplier.name.toLowerCase().includes(searchTerm) || 
                supplier.phone.includes(searchTerm)
            );
            
            suppliersTable.innerHTML = '';
            filtered.forEach(supplier => {
                const row = suppliersTable.insertRow();
                row.innerHTML = `
                    <td>NCC${supplier.id.toString().padStart(3, '0')}</td>
                    <td>${supplier.name}</td>
                    <td>${supplier.phone}</td>
                    <td>${supplier.address}</td>
                    <td>${supplier.products}</td>
                    <td>
                        <button class="btn-edit" data-id="${supplier.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-danger" data-id="${supplier.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        });
        
        renderSuppliers();
    }

    // Initialize sales management
    function initSales() {
        const customerSelect = document.getElementById('customer-select');
        const medicineSaleList = document.getElementById('medicine-sale-list');
        const cartItems = document.getElementById('cart-items');
        let cart = [];
        
        // Populate customer select
        function populateCustomerSelect() {
            customerSelect.innerHTML = '<option value="">Khách lẻ</option>';
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = customer.name;
                customerSelect.appendChild(option);
            });
        }
        
        // Display medicine list for sale
        function displayMedicineSaleList() {
            medicineSaleList.innerHTML = '';
            medicines.forEach(medicine => {
                if (medicine.quantity > 0) {
                    const div = document.createElement('div');
                    div.className = 'medicine-item';
                    div.innerHTML = `
                        <div>
                            <strong>${medicine.name}</strong> (${medicine.code})
                            <small>${medicine.salePrice.toLocaleString()} đ/${medicine.unit}</small>
                        </div>
                        <button class="add-to-cart" data-id="${medicine.id}">Thêm</button>
                    `;
                    medicineSaleList.appendChild(div);
                }
            });
        }
        
        // Update cart display
        function updateCart() {
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const medicine = medicines.find(m => m.id === item.medicineId);
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>
                        <small>${item.price.toLocaleString()} đ × ${item.quantity}</small>
                    </div>
                    <div>
                        <strong>${item.total.toLocaleString()} đ</strong>
                        <button class="btn-danger btn-sm remove-item" data-id="${item.medicineId}"><i class="fas fa-times"></i></button>
                    </div>
                `;
                cartItems.appendChild(div);
                total += item.total;
            });
            
            document.getElementById('cart-total-amount').textContent = total.toLocaleString();
        }
        
        // Customer select change
        customerSelect.addEventListener('change', function() {
            const customerId = parseInt(this.value);
            const customerDetails = document.getElementById('customer-details');
            
            if (customerId) {
                const customer = customers.find(c => c.id === customerId);
                customerDetails.innerHTML = `
                    <p><strong>Điện thoại:</strong> ${customer.phone}</p>
                    <p><strong>Địa chỉ:</strong> ${customer.address}</p>
                `;
                customerDetails.style.display = 'block';
            } else {
                customerDetails.style.display = 'none';
            }
        });
        
        // Add to cart
        medicineSaleList.addEventListener('click', function(e) {
            if (e.target.closest('.add-to-cart')) {
                const medicineId = parseInt(e.target.closest('.add-to-cart').getAttribute('data-id'));
                const medicine = medicines.find(m => m.id === medicineId);
                
                // Check if already in cart
                const existingItem = cart.find(item => item.medicineId === medicineId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                    existingItem.total = existingItem.quantity * existingItem.price;
                } else {
                    cart.push({
                        medicineId: medicine.id,
                        name: medicine.name,
                        quantity: 1,
                        price: medicine.salePrice,
                        total: medicine.salePrice
                    });
                }
                
                updateCart();
            }
        });
        
        // Remove from cart
        cartItems.addEventListener('click', function(e) {
            if (e.target.closest('.remove-item')) {
                const medicineId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
                cart = cart.filter(item => item.medicineId !== medicineId);
                updateCart();
            }
        });
        
        // Search medicine for sale
        document.querySelector('#medicine-sale-search + .btn-search').addEventListener('click', function() {
            const searchTerm = document.getElementById('medicine-sale-search').value.toLowerCase();
            const filtered = medicines.filter(medicine => 
                (medicine.name.toLowerCase().includes(searchTerm) || 
                (medicine.code.toLowerCase().includes(searchTerm))
            ) && medicine.quantity > 0);
            
            medicineSaleList.innerHTML = '';
            filtered.forEach(medicine => {
                if (medicine.quantity > 0) {
                    const div = document.createElement('div');
                    div.className = 'medicine-item';
                    div.innerHTML = `
                        <div>
                            <strong>${medicine.name}</strong> (${medicine.code})
                            <small>${medicine.salePrice.toLocaleString()} đ/${medicine.unit}</small>
                        </div>
                        <button class="add-to-cart" data-id="${medicine.id}">Thêm</button>
                    `;
                    medicineSaleList.appendChild(div);
                }
            });
        });
        
        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng!');
                return;
            }
            
            openCheckoutModal();
        });
        
        populateCustomerSelect();
        displayMedicineSaleList();
    }

    // Initialize reports
    function initReports() {
        const reportTypeSelect = document.getElementById('report-type');
        const reportPeriodSelect = document.getElementById('report-period');
        const customDateRange = document.getElementById('custom-date-range');
        const generateReportBtn = document.getElementById('generate-report-btn');
        const reportResults = document.getElementById('report-results');
        
        // Show/hide custom date range
        reportPeriodSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
            }
        });
        
        // Generate report
        generateReportBtn.addEventListener('click', function() {
            const reportType = reportTypeSelect.value;
            const reportPeriod = reportPeriodSelect.value;
            
            let reportContent = '';
            
            if (reportType === 'sales') {
                reportContent = generateSalesReport(reportPeriod);
            } else if (reportType === 'inventory') {
                reportContent = generateInventoryReport();
            } else if (reportType === 'expiry') {
                reportContent = generateExpiryReport();
            }
            
            reportResults.innerHTML = reportContent;
        });
        
        // Generate sales report
        function generateSalesReport(period) {
            let filteredSales = [...sales];
            let title = 'Báo cáo bán hàng';
            
            // In a real app, we would filter by actual dates
            if (period === 'today') {
                title += ' hôm nay';
            } else if (period === 'week') {
                title += ' tuần này';
            } else if (period === 'month') {
                title += ' tháng này';
            } else if (period === 'quarter') {
                title += ' quý này';
            } else if (period === 'year') {
                title += ' năm nay';
            } else if (period === 'custom') {
                const startDate = document.getElementById('start-date').value;
                const endDate = document.getElementById('end-date').value;
                title += ` từ ${formatDate(startDate)} đến ${formatDate(endDate)}`;
            }
            
            const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
            const totalItems = filteredSales.reduce((sum, sale) => sum + sale.items.length, 0);
            
            let html = `
                <h3>${title}</h3>
                <div class="report-summary">
                    <p><strong>Tổng đơn hàng:</strong> ${filteredSales.length}</p>
                    <p><strong>Tổng sản phẩm bán:</strong> ${totalItems}</p>
                    <p><strong>Tổng doanh thu:</strong> ${totalSales.toLocaleString()} đ</p>
                </div>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            filteredSales.forEach(sale => {
                const customer = customers.find(c => c.id === sale.customerId);
                html += `
                    <tr>
                        <td>#${sale.id}</td>
                        <td>${customer ? customer.name : 'Khách lẻ'}</td>
                        <td>${formatDate(sale.date)}</td>
                        <td>${sale.items.length}</td>
                        <td>${sale.total.toLocaleString()} đ</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            return html;
        }
        
        // Generate inventory report
        function generateInventoryReport() {
            let html = `
                <h3>Báo cáo tồn kho</h3>
                <div class="report-summary">
                    <p><strong>Tổng số thuốc:</strong> ${medicines.length}</p>
                    <p><strong>Tổng giá trị tồn kho:</strong> ${calculateInventoryValue().toLocaleString()} đ</p>
                </div>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Mã thuốc</th>
                            <th>Tên thuốc</th>
                            <th>Số lượng</th>
                            <th>Giá nhập</th>
                            <th>Giá bán</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            medicines.forEach(medicine => {
                const value = medicine.quantity * medicine.importPrice;
                html += `
                    <tr>
                        <td>${medicine.code}</td>
                        <td>${medicine.name}</td>
                        <td class="${medicine.quantity < 10 ? 'text-danger' : ''}">${medicine.quantity}</td>
                        <td>${medicine.importPrice.toLocaleString()} đ</td>
                        <td>${medicine.salePrice.toLocaleString()} đ</td>
                        <td>${value.toLocaleString()} đ</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            return html;
        }
        
        // Generate expiry report
        function generateExpiryReport() {
            // For demo, we'll just show medicines expiring in the next 3 months
            const soonExpiryMedicines = medicines.filter(medicine => {
                const expiryDate = new Date(medicine.expiry);
                const threeMonthsFromNow = new Date();
                threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                return expiryDate <= threeMonthsFromNow;
            });
            
            let html = `
                <h3>Báo cáo thuốc sắp hết hạn</h3>
                <div class="report-summary">
                    <p><strong>Số thuốc sắp hết hạn:</strong> ${soonExpiryMedicines.length}</p>
                </div>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Mã thuốc</th>
                            <th>Tên thuốc</th>
                            <th>Số lượng</th>
                            <th>Hạn sử dụng</th>
                            <th>Còn lại (ngày)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            soonExpiryMedicines.forEach(medicine => {
                const expiryDate = new Date(medicine.expiry);
                const today = new Date();
                const diffTime = expiryDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                html += `
                    <tr>
                        <td>${medicine.code}</td>
                        <td>${medicine.name}</td>
                        <td>${medicine.quantity}</td>
                        <td>${formatDate(medicine.expiry)}</td>
                        <td class="${diffDays <= 30 ? 'text-danger' : 'text-warning'}">${diffDays}</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            return html;
        }
        
        // Calculate total inventory value
        function calculateInventoryValue() {
            return medicines.reduce((total, medicine) => {
                return total + (medicine.quantity * medicine.importPrice);
            }, 0);
        }
    }

    // Medicine modal functions
    function openMedicineModal(medicine = null) {
        const modal = document.getElementById('medicine-modal');
        const form = document.getElementById('medicine-form');
        const title = document.getElementById('medicine-modal-title');
        
        if (medicine) {
            // Edit mode
            title.textContent = 'Chỉnh sửa thông tin thuốc';
            form.elements['medicine-id'].value = medicine.id;
            form.elements['medicine-code'].value = medicine.code;
            form.elements['medicine-name'].value = medicine.name;
            form.elements['medicine-type'].value = medicine.type;
            form.elements['medicine-unit'].value = medicine.unit;
            form.elements['medicine-quantity'].value = medicine.quantity;
            form.elements['medicine-import-price'].value = medicine.importPrice;
            form.elements['medicine-sale-price'].value = medicine.salePrice;
            form.elements['medicine-expiry'].value = medicine.expiry;
        } else {
            // Add mode
            title.textContent = 'Thêm thuốc mới';
            form.reset();
            form.elements['medicine-code'].value = 'TH' + (medicines.length + 1).toString().padStart(3, '0');
        }
        
        modal.style.display = 'block';
        
        // Close modal when clicking X
        document.querySelector('#medicine-modal .close').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Handle medicine form submission
    document.getElementById('medicine-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = e.target;
        const medicineId = form.elements['medicine-id'].value;
        const medicineData = {
            id: medicineId ? parseInt(medicineId) : medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1,
            code: form.elements['medicine-code'].value,
            name: form.elements['medicine-name'].value,
            type: form.elements['medicine-type'].value,
            unit: form.elements['medicine-unit'].value,
            quantity: parseInt(form.elements['medicine-quantity'].value),
            importPrice: parseInt(form.elements['medicine-import-price'].value),
            salePrice: parseInt(form.elements['medicine-sale-price'].value),
            expiry: form.elements['medicine-expiry'].value
        };
        
        if (medicineId) {
            // Update existing medicine
            const index = medicines.findIndex(m => m.id === parseInt(medicineId));
            if (index !== -1) {
                medicines[index] = medicineData;
                showNotification('Cập nhật thuốc thành công!');
            }
        } else {
            // Add new medicine
            medicines.push(medicineData);
            showNotification('Thêm thuốc mới thành công!');
            
            // Add to activities
            activities.unshift({
                id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
                type: 'import',
                description: `Nhập kho ${medicineData.quantity} ${medicineData.name}`,
                date: new Date().toLocaleString('vi-VN')
            });
        }
        
        // Close modal and refresh
        document.getElementById('medicine-modal').style.display = 'none';
        initMedicines();
        initDashboard();
    });

    // Customer modal functions
    function openCustomerModal(customer = null) {
        const modal = document.getElementById('customer-modal');
        const form = document.getElementById('customer-form');
        const title = document.getElementById('customer-modal-title');
        
        if (customer) {
            // Edit mode
            title.textContent = 'Chỉnh sửa thông tin khách hàng';
            form.elements['customer-id'].value = customer.id;
            form.elements['customer-name'].value = customer.name;
            form.elements['customer-phone'].value = customer.phone;
            form.elements['customer-address'].value = customer.address;
            form.elements['customer-dob'].value = customer.dob || '';
        } else {
            // Add mode
            title.textContent = 'Thêm khách hàng mới';
            form.reset();
        }
        
        modal.style.display = 'block';
        
        // Close modal when clicking X
        document.querySelector('#customer-modal .close').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Handle customer form submission
    document.getElementById('customer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = e.target;
        const customerId = form.elements['customer-id'].value;
        const customerData = {
            id: customerId ? parseInt(customerId) : customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
            name: form.elements['customer-name'].value,
            phone: form.elements['customer-phone'].value,
            address: form.elements['customer-address'].value,
            dob: form.elements['customer-dob'].value || null
        };
        
        if (customerId) {
            // Update existing customer
            const index = customers.findIndex(c => c.id === parseInt(customerId));
            if (index !== -1) {
                customers[index] = customerData;
                showNotification('Cập nhật khách hàng thành công!');
            }
        } else {
            // Add new customer
            customers.push(customerData);
            showNotification('Thêm khách hàng mới thành công!');
        }
        
        // Close modal and refresh
        document.getElementById('customer-modal').style.display = 'none';
        initCustomers();
        initDashboard();
    });

    // Supplier modal functions
    function openSupplierModal(supplier = null) {
        const modal = document.getElementById('supplier-modal');
        const form = document.getElementById('supplier-form');
        const title = document.getElementById('supplier-modal-title');
        
        if (supplier) {
            // Edit mode
            title.textContent = 'Chỉnh sửa thông tin nhà cung cấp';
            form.elements['supplier-id'].value = supplier.id;
            form.elements['supplier-name'].value = supplier.name;
            form.elements['supplier-phone'].value = supplier.phone;
            form.elements['supplier-address'].value = supplier.address;
            form.elements['supplier-products'].value = supplier.products;
        } else {
            // Add mode
            title.textContent = 'Thêm nhà cung cấp mới';
            form.reset();
        }
        
        modal.style.display = 'block';
        
        // Close modal when clicking X
        document.querySelector('#supplier-modal .close').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Handle supplier form submission
    document.getElementById('supplier-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = e.target;
        const supplierId = form.elements['supplier-id'].value;
        const supplierData = {
            id: supplierId ? parseInt(supplierId) : suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
            name: form.elements['supplier-name'].value,
            phone: form.elements['supplier-phone'].value,
            address: form.elements['supplier-address'].value,
            products: form.elements['supplier-products'].value
        };
        
        if (supplierId) {
            // Update existing supplier
            const index = suppliers.findIndex(s => s.id === parseInt(supplierId));
            if (index !== -1) {
                suppliers[index] = supplierData;
                showNotification('Cập nhật nhà cung cấp thành công!');
            }
        } else {
            // Add new supplier
            suppliers.push(supplierData);
            showNotification('Thêm nhà cung cấp mới thành công!');
        }
        
        // Close modal and refresh
        document.getElementById('supplier-modal').style.display = 'none';
        initSuppliers();
    });

    // Checkout modal functions
    function openCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        const cartTotal = document.getElementById('cart-total-amount').textContent;
        
        document.getElementById('checkout-total-amount').textContent = cartTotal;
        
        const customerId = parseInt(document.getElementById('customer-select').value);
        if (customerId) {
            const customer = customers.find(c => c.id === customerId);
            document.getElementById('checkout-customer-name').textContent = customer.name;
        } else {
            document.getElementById('checkout-customer-name').textContent = 'Khách lẻ';
        }
        
        modal.style.display = 'block';
        
        // Close modal when clicking X
        document.querySelector('#checkout-modal .close').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Calculate change when amount received changes
        document.getElementById('amount-received').addEventListener('input', function() {
            const total = parseFloat(cartTotal.replace(/,/g, ''));
            const received = parseFloat(this.value) || 0;
            const change = received - total;
            
            document.getElementById('change').value = change >= 0 ? change.toLocaleString() + ' đ' : 'Không đủ';
        });
    }
    
    // Handle checkout confirmation
    document.getElementById('confirm-checkout-btn').addEventListener('click', function() {
        const cartTotal = parseFloat(document.getElementById('cart-total-amount').textContent.replace(/,/g, ''));
        const received = parseFloat(document.getElementById('amount-received').value) || 0;
        
        if (received < cartTotal) {
            alert('Số tiền nhận không được nhỏ hơn tổng tiền!');
            return;
        }
        
        const customerId = parseInt(document.getElementById('customer-select').value);
        const paymentMethod = document.getElementById('payment-method').value;
        
        // Create new sale
        const newSaleId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
        const cartItems = Array.from(document.querySelectorAll('.cart-item')).map(item => {
            const medicineId = parseInt(item.querySelector('.remove-item').getAttribute('data-id'));
            const medicine = medicines.find(m => m.id === medicineId);
            const quantity = parseInt(item.querySelector('small').textContent.split('×')[1].trim());
            
            // Update medicine quantity
            medicine.quantity -= quantity;
            
            return {
                medicineId: medicine.id,
                name: medicine.name,
                quantity: quantity,
                price: medicine.salePrice,
                total: quantity * medicine.salePrice
            };
        });
        
        const newSale = {
            id: newSaleId,
            customerId: customerId || null,
            date: new Date().toISOString().split('T')[0],
            total: cartTotal,
            items: cartItems
        };
        
        sales.unshift(newSale);
        
        // Add to activities
        activities.unshift({
            id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
            type: 'sale',
            description: `Bán đơn hàng #${newSaleId} cho ${customerId ? customers.find(c => c.id === customerId).name : 'Khách lẻ'}`,
            date: new Date().toLocaleString('vi-VN')
        });
        
        // Reset cart
        document.getElementById('cart-items').innerHTML = '';
        document.getElementById('cart-total-amount').textContent = '0';
        document.getElementById('customer-select').value = '';
        document.getElementById('customer-details').style.display = 'none';
        
        // Close modal and show success
        document.getElementById('checkout-modal').style.display = 'none';
        showNotification('Thanh toán thành công!');
        
        // Refresh data
        initDashboard();
        initMedicines();
        initSales();
    });

    // Utility functions
    function getMedicineTypeName(type) {
        const types = {
            'antibiotic': 'Kháng sinh',
            'painkiller': 'Giảm đau',
            'fever': 'Hạ sốt',
            'allergy': 'Dị ứng',
            'digestive': 'Tiêu hóa',
            'vitamin': 'Vitamin',
            'other': 'Khác'
        };
        return types[type] || type;
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Initialize all sections
    initDashboard();
    initMedicines();
    initCustomers();
    initSuppliers();
    initSales();
    initReports();
});
