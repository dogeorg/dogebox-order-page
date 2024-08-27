$(document).ready(function() {
    // Load content into sections using jQuery .load() method
    $('#step1').load('step1.html', function() {
        initializeSection1(); // Initialize events for step 1
    });
    $('#step2').load('step2.html', function() {
        initializeSection2(); // Initialize events for step 2
    });
    $('#step3').load('step3.html', function() {
        initializeSection3(); // Initialize events for step 3
    });
});

function initializeSection1() {
    // Initialize DataTable after ensuring the table is loaded
    $('#specsTable').DataTable({
        responsive: true,
        paging: false,
        searching: false,
        info: false
    });

    // Load dialog content dynamically
    loadDialogContent('db1', 'db1.html');
    loadDialogContent('db2', 'db2.html');
    loadDialogContent('db3', 'db3.html');

    // Use event delegation to handle dynamically loaded content
    $('#step1').on('click', '.db1', function() {
        // Show dialog for db1
        const dialog = document.querySelector('#db1-dialog');
        if (dialog) {
            dialog.show(); // Show the dialog using Shoelace's method
        }
    });

    $('#step1').on('click', '#btn2500-in', function() { 
        selectAmount(2500); 
        const dialog = document.querySelector('#db1-dialog');
        if (dialog) {
            dialog.hide(); // Hide the dialog using Shoelace's method
        }
    });

    $('#step1').on('click', '.db2', function() {
        // Show dialog for db2
        const dialog = document.querySelector('#db2-dialog');
        if (dialog) {
            dialog.show(); // Show the dialog using Shoelace's method
        }
    });

    $('#step1').on('click', '#btn3500-in', function() { 
        selectAmount(3500); 
        const dialog = document.querySelector('#db2-dialog');
        if (dialog) {
            dialog.hide(); // Hide the dialog using Shoelace's method
        }
    });

    $('#step1').on('click', '.db3', function() {
        // Show dialog for db3
        const dialog = document.querySelector('#db3-dialog');
        if (dialog) {
            dialog.show(); // Show the dialog using Shoelace's method
        }
    });

    $('#step1').on('click', '#btn4000-in', function() { 
        selectAmount(4000); 
        const dialog = document.querySelector('#db3-dialog');
        if (dialog) {
            dialog.hide(); // Hide the dialog using Shoelace's method
        }
    });      

    // Handle button clicks for other elements
    $(document).on('click', '#btn2500', function() { selectAmount(2500); });
    $(document).on('click', '#btn3500', function() { selectAmount(3500); });
    $(document).on('click', '#btn4000', function() { selectAmount(4000); });
}

function initializeSection2() {
    // Load dialog content dynamically for step 2
    loadDialogContent('db1-l', 'db1.html');
    loadDialogContent('db2-l', 'db2.html');
    loadDialogContent('db3-l', 'db3.html');

    // Initialize other elements or events for step 2
    $('.input-validation-required').on('submit', function(event) {
        event.preventDefault();
        if (this.reportValidity()) {
            sendtoGigaWallet(); // Call async function
        }
    });
}

function loadDialogContent(containerId, fileName) {
    fetch(fileName)
        .then(response => response.text())
        .then(data => {
            $('#' + containerId).html(data);
        })
        .catch(error => console.error('Error loading file:', error));
}

let selectedAmount = 0;
function selectAmount(amount) {
    selectedAmount = amount;
    $('#step1').removeClass('active');
    $('#step2').addClass('active');
}

async function sendtoGigaWallet() {
    const form = document.getElementById('PayinDoge');
    if (!form.reportValidity()) {
        return;
    }

    const formData = new FormData(form);
    formData.append('amount', selectedAmount);

    try {
        const response = await fetch('https://what-is-dogecoin.com/foundation/dogebox/gigawallet.php', {
            method: 'POST', // Use POST instead of GET
            body: formData
        });

        if (response.ok) {              
            const data = await response.json();
            $('#step2').removeClass('active');
            $('#step3').addClass('active');
            $('#amount').text(selectedAmount);
            $('#dogeAddress').val(data.id);
        } else {
            showAlert('warning', 'So Sad', 'Sorry shibe, there was a problem, try again!');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('warning', 'So Sad', 'Sorry shibe, there was a problem, try again!');
    }
}

function initializeSection3() {
    // Placeholder for step 3 initialization on Gigawallet payment details
}

// Show Much sad on error
function showAlert(icon, title, html) {
    Swal.fire({
        icon: icon,
        title: title,
        background: '#000000',
        showConfirmButton: true,
        confirmButtonColor: '#580DA9',
        html: `<img src="img/sad_doge.gif" style="border-radius: 20px"><br>${html}`,
        customClass: { popup: 'dogebox-swal' }                       
    });
}
