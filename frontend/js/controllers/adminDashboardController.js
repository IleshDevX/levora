// AdminDashboardController
app.controller('AdminDashboardController', ['$scope', '$timeout', 'DashboardService', 'AuthService', 'ToastService',
    function ($scope, $timeout, DashboardService, AuthService, ToastService) {
        $scope.user = AuthService.getUser() || {};
        $scope.counts = {};
        $scope.recentActivity = [];
        $scope.loading = true;
        $scope.chartLoaded = false;

        function loadDashboard() {
            $scope.loading = true;

            DashboardService.getCounts().then(function (res) {
                $scope.counts = res.data;
            });

            DashboardService.getRecentActivity().then(function (res) {
                $scope.recentActivity = res.data;
            });

            // Load chart data
            DashboardService.getLeavesByMonth().then(function (res) {
                $scope.loading = false;
                $timeout(function () {
                    renderChart(res.data);
                }, 100);
            }).catch(function () {
                $scope.loading = false;
            });
        }

        function renderChart(data) {
            var canvas = document.getElementById('leavesChart');
            if (!canvas) return;

            var ctx = canvas.getContext('2d');

            // Destroy existing chart if any
            if ($scope.chart) {
                $scope.chart.destroy();
            }

            $scope.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(function (d) { return d.month; }),
                    datasets: [{
                        label: 'Total Leaves',
                        data: data.map(function (d) { return d.count; }),
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 32
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1E293B',
                            titleFont: { family: 'Inter', size: 13 },
                            bodyFont: { family: 'Inter', size: 12 },
                            cornerRadius: 8,
                            padding: 12
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: { family: 'Inter', size: 12 },
                                color: '#64748B'
                            },
                            grid: { color: '#F1F5F9' }
                        },
                        x: {
                            ticks: {
                                font: { family: 'Inter', size: 12 },
                                color: '#64748B'
                            },
                            grid: { display: false }
                        }
                    }
                }
            });
            $scope.chartLoaded = true;
        }

        loadDashboard();

        $scope.$on('$destroy', function () {
            if ($scope.chart) {
                $scope.chart.destroy();
            }
        });
    }
]);
