document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const accountsGrid = document.getElementById('accountsGrid');
    const featuresGrid = document.getElementById('featuresGrid');
    const totalBalanceElement = document.getElementById('totalBalance');
    const creditScoreElement = document.getElementById('creditScore');

    // Initialize the dashboard
    async function initDashboard() {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Load real data
        await fetchRealData(token);
        
        // Load features (static content)
        renderFeatures();
        
        // Set up navigation
        setupNavigation();
    }

    // Fetch real data from backend
    async function fetchRealData(token) {
        try {
            // Fetch accounts and balance
            const [accountsRes, profileRes] = await Promise.all([
                fetch('/api/v1/accounts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch('/api/v1/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            if (!accountsRes.ok || !profileRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const accountsData = await accountsRes.json();
            const profileData = await profileRes.json();

            // Update UI
            totalBalanceElement.textContent = `$${profileData.totalBalance.toFixed(2)}`;
            creditScoreElement.textContent = profileData.creditScore;
            
            // Render accounts
            renderAccounts(accountsData.data);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load data. Please try again later.');
        }
    }

    // Render accounts to the grid
    function renderAccounts(accounts) {
        accountsGrid.innerHTML = '';
        
        accounts.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            accountCard.innerHTML = `
                <h3>${account.institution}</h3>
                <p class="balance">$${account.balance.toFixed(2)}</p>
                <p class="type">${account.type}</p>
            `;
            accountsGrid.appendChild(accountCard);
        });
    }

    // Render features (static content)
    function renderFeatures() {
        const features = [
            'All-In-One Dashboard',
            'Smart Financial Insights',
            'Enhanced Credit Score System', 
            'Top-Level Security & Privacy',
            'Instant Alerts & Automation',
            'Rewards & Perks',
            'Simple, Intuitive UI'
        ];
        
        featuresGrid.innerHTML = '';
        features.forEach(feature => {
            const featureCard = document.createElement('div');
            featureCard.className = 'feature-card';
            featureCard.textContent = feature;
            featuresGrid.appendChild(featureCard);
        });
    }

    // Set up navigation
    function setupNavigation() {
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                navButtons.forEach(btn => btn.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                button.classList.add('active');
                const sectionId = button.getAttribute('data-section');
                document.getElementById(`${sectionId}-section`).classList.add('active');
            });
        });
    }

    // Initialize the dashboard
    initDashboard();
});
