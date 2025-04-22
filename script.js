document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'https://man-m681.onrender.com';
    let selectedFiles = [];
    
    // DOM Elements
    const programSelect = document.getElementById('program-select');
    const reportTitle = document.getElementById('report-title');
    const reportEditor = document.getElementById('report-editor');
    const fileInput = document.getElementById('report-attachments');
    const filePreview = document.getElementById('file-preview');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const submitReportBtn = document.getElementById('submit-report-btn');
    const reportsList = document.getElementById('reports-list');
    const successModal = document.getElementById('success-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Initialize the app
    init();
    
    function init() {
        // Load programs/activities
        loadPrograms();
        
        // Load recent reports
        loadRecentReports();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // File upload handling
        fileInput.addEventListener('change', handleFileSelect);
        
        // Save draft button
        saveDraftBtn.addEventListener('click', saveDraft);
        
        // Submit report button
        submitReportBtn.addEventListener('click', submitReport);
        
        // Close modal buttons
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                successModal.classList.remove('active');
            });
        });
    }
    
    async function loadPrograms() {
        try {
            // Fetch activities from the API
            const response = await fetch(`${API_BASE_URL}/activities/`);
            if (!response.ok) throw new Error('Failed to fetch activities');
            
            const activities = await response.json();
            
            // Clear existing options
            programSelect.innerHTML = '<option value="" disabled selected>Select an activity</option>';
            
            // Add activities to the select dropdown
            activities.forEach(activity => {
                const option = document.createElement('option');
                option.value = activity.id;
                option.textContent = `${activity.name} (${activity.project_name})`;
                programSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading programs:', error);
            showError('Failed to load programs. Please try again later.');
        }
    }
    
    async function loadRecentReports() {
        try {
            // In a real app, you would fetch reports from your API
            // For now, we'll use mock data
            const mockReports = [
                {
                    id: 1,
                    title: "Quarterly Education Program Report",
                    activity: "Community Education",
                    date: "2023-06-15",
                    status: "Submitted"
                },
                {
                    id: 2,
                    title: "Health Camp Summary",
                    activity: "Rural Health Initiative",
                    date: "2023-05-28",
                    status: "Draft"
                },
                {
                    id: 3,
                    title: "Women Empowerment Workshop",
                    activity: "Gender Equality Program",
                    date: "2023-04-10",
                    status: "Approved"
                }
            ];
            
            // Clear existing reports
            reportsList.innerHTML = '';
            
            // Add reports to the list
            mockReports.forEach(report => {
                const reportItem = document.createElement('div');
                reportItem.className = 'report-item';
                reportItem.innerHTML = `
                    <div class="report-title">${report.title}</div>
                    <div class="report-meta">
                        <span>${report.activity}</span>
                        <span>${formatDate(report.date)}</span>
                    </div>
                `;
                reportsList.appendChild(reportItem);
            });
        } catch (error) {
            console.error('Error loading recent reports:', error);
        }
    }
    
    function handleFileSelect(event) {
        const files = event.target.files;
        selectedFiles = Array.from(files);
        
        // Clear previous previews
        filePreview.innerHTML = '';
        
        // Display file previews
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="fas fa-file-alt"></i>
                <span>${file.name}</span>
                <span class="remove-file" data-index="${index}">&times;</span>
            `;
            filePreview.appendChild(fileItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-file').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute('data-index'));
                selectedFiles.splice(index, 1);
                handleFileSelect({ target: { files: selectedFiles } });
            });
        });
    }
    
    function saveDraft() {
        const activityId = programSelect.value;
        const title = reportTitle.value.trim();
        const content = reportEditor.innerHTML;
        
        if (!activityId) {
            showError('Please select an activity');
            return;
        }
        
        if (!title) {
            showError('Please enter a report title');
            return;
        }
        
        // In a real app, you would save to your backend
        console.log('Saving draft:', { activityId, title, content, files: selectedFiles });
        showSuccess('Draft saved successfully');
    }
    
    async function submitReport() {
        const activityId = programSelect.value;
        const title = reportTitle.value.trim();
        const content = reportEditor.innerHTML;
        
        if (!activityId) {
            showError('Please select an activity');
            return;
        }
        
        if (!title) {
            showError('Please enter a report title');
            return;
        }
        
        if (!content || content === '<br>' || content === '<div><br></div>') {
            showError('Please enter report content');
            return;
        }
        
        try {
            // Create form data for file uploads
            const formData = new FormData();
            formData.append('activity_id', activityId);
            formData.append('title', title);
            formData.append('content', content);
            
            // Add files if any
            selectedFiles.forEach(file => {
                formData.append('attachments', file);
            });
            
            // In a real app, you would submit to your API
            // For now, we'll simulate a successful submission
            console.log('Submitting report:', { activityId, title, content, files: selectedFiles });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            showSuccessModal();
            
            // Reset form
            resetForm();
            
        } catch (error) {
            console.error('Error submitting report:', error);
            showError('Failed to submit report. Please try again.');
        }
    }
    
    function resetForm() {
        programSelect.value = '';
        reportTitle.value = '';
        reportEditor.innerHTML = '';
        filePreview.innerHTML = '';
        selectedFiles = [];
        fileInput.value = '';
    }
    
    function showSuccessModal() {
        successModal.classList.add('active');
    }
    
    function showError(message) {
        alert(message); // In a real app, you'd use a nicer notification system
    }
    
    function showSuccess(message) {
        alert(message); // In a real app, you'd use a nicer notification system
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});
