$(document).ready(function () {
    
    // Such variables for SKU and price globally
    let sku, price;
    updateProductDetails();
    
    // Such function to fetch shipping options based on the selected country
    function fetchShippingOptions(countryCode) {
        
        $.post('inc/vendors/shipper-api.php', 
        JSON.stringify({ sku: sku, country: countryCode }), 
        function (response) {
            if (response.success) {
                const shippingOptions = response.options;
                let shippingSelectHtml = '<sl-select name="shippingOptions" id="shipping-options" placeholder="Select one">';
                shippingOptions.forEach(option => {
                    shippingSelectHtml += `<sl-option value="${option.price_shipping_and_handling_only}">${option.label} - Ð ${option.price_shipping_and_handling_only}</sl-option>`;
                    parseFloat($('#price-doge').text(option.price_product_only));
                });
    
                shippingSelectHtml += '</sl-select>';        
    
                $('#shipping-doge').html(shippingSelectHtml);
                $('#shipping-select').show();
                $('#shipping-options').on('sl-change', function () {              
                    updateTotalPrice();
                    $('#total-pay').show();
                });
    
                // SO calculate total price with the default shipping option
                updateTotalPrice();
    
            }
        }, 'json');
    }

    // Such function to update the total price
    function updateTotalPrice() {
      
        const productPrice = parseFloat($('#price-doge').text());
        const shippingPrice = parseFloat($('#shipping-options').val());
        const totalPrice = productPrice + shippingPrice;
        $('#total-doge').text(totalPrice);
        $('#amount').html('Ð ' + totalPrice);
    }


    // Such function to update the total price
    function updateTotalPrice() {      
        const productPrice = parseFloat($('#price-doge').text());
        const shippingPrice = parseFloat($('#shipping-options').val());
        const totalPrice = productPrice + shippingPrice;
        $('#total-doge').text(totalPrice);
        $('#amount').html('Ð ' + totalPrice);
    }

    // Much when country is changed, fetch shipping options
    $('sl-select[name="country"]').on('sl-change', function () {
        const selectedCountry = $(this).val();
        if (selectedCountry) {
          $('#total-pay').hide();
            fetchShippingOptions(selectedCountry);
        }
    });

    // So automatically expand "Billing Details" section if Dogecoin address is entered
    $('#dogeadd').on('input', function () {
          if ($(this).val().trim() !== '') {
              // Expand the Billing Details section
              document.querySelectorAll('sl-details')[1].open = true;
  
          }
    });
  
    $('sl-checkbox[name="terms"]').on('sl-change', function() {
        if (this.checked) {
            $('#checkout').show();  // Show checkout section
        } else {
            $('#checkout').hide();  // Optionally hide checkout section
        }
    });

    $('.input-validation-required').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        if (this.reportValidity()) {
            const dogecoinAdd = $('#dogeadd').val();
            // Thanks to https://x.com/patricklodder we can check if the DogeAddress is valid
            if (!bs58caddr.validateCoinAddress('DOGE', dogecoinAdd)) {
                showAlert('warning', 'So Sad', 'Sorry Shibe, Doge Address is not valid!');
                return;
            }

            // Address is valid, proceed with form submission
            sendtoGigaWallet();
        }
    });

    // a Bub on Mobile Google Chrome only, tryng to debug
    async function sendtoGigaWallet() {

    const form = document.getElementById('PayinDoge');

    if (!form.reportValidity()) {
        return;
    }

    const formData = {
        sku: sku,
        name: $('sl-input[name="name"]').val(),
        email: $('sl-input[name="email"]').val(),
        country: $('sl-select[name="country"]').val(),
        address: $('sl-input[name="address"]').val(),
        postalCode: $('sl-input[name="postalCode"]').val(),
        dogeAddress: $('sl-input[name="dogeAddress"]').val(),
        size: $('sl-select[name="size"]').val(),
        bname: $('sl-input[name="bname"]').val(),
        bemail: $('sl-input[name="bemail"]').val(),
        bcountry: $('sl-select[name="bcountry"]').val(),
        baddress: $('sl-input[name="baddress"]').val(),
        bpostalCode: $('sl-input[name="bpostalCode"]').val(),
        amount: $('#total-doge').text()
    };

    $.post(
        'inc/vendors/gigawallet-api.php',
        JSON.stringify(formData),
        function(response) {
            // Check if response contains the required data
            if (response && response.GigaQR && response.PaytoDogeAddress) {
                $('#dogeQR').html(response.GigaQR);
                $('#dogeAddress').text(response.PaytoDogeAddress);
                $('#PayinDoge').hide();
                $('.Pay').show();
            } else {
                showAlert('warning', 'So Sad', 'Sorry shibe, there was a problem with the response, try again!');
            }
        },
        'json' // Expecting the response in JSON format
    ).fail(function(jqXHR, textStatus, errorThrown) {
        // Handle the error
        console.error('Error:', textStatus, errorThrown);
        showAlert('warning', 'So Sad', 'Sorry shibe, there was a problem, try again!');
    });

}

    // Much function to fetch SKU and price from URL parameters and update the DOM
    function updateProductDetails() {

        // URL to fetch countries data
        const countriesUrl = 'inc/vendors/shipper-api.php';
    
        $.getJSON(countriesUrl, function (data) {
            if (data.success) {
                const countries = data.countries;
    
                function populateSelects() {
                    const countryOptions = countries.map(country =>
                        `<sl-option value="${country.code}">${country.name}</sl-option>`
                    ).join('');

                    $('sl-select[name="country"]').html(countryOptions);
                    $('sl-select[name="bcountry"]').html(countryOptions);
                }
    
                // So populate selects
                populateSelects();
            } else {          
                console.error('Failed to fetch countries data');
            }
        }).fail(function () {
            console.error('Error fetching countries data');
        });


        // Such get the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Fetch 'sku' and 'price' parameters from the URL
        sku = urlParams.get('sku') || 'b0rk'; // fallback to 'b0rk' if not found
        price = urlParams.get('price') || '0'; // fallback to '0' if not found
        
        // Update the <span> elements if the values exist
        if (sku) {
            
            document.getElementById('product-doge').textContent = sku;
            // Show size selection only if SKU is 'b0rk'
            if (sku === "b0rk") {
                document.getElementById('size-select').style.display = 'block';
            } else {
                document.getElementById('size-select').style.display = 'none';
            }            
        }
        if (price) {
            document.getElementById('price-doge').textContent = price;
        }
    }

    document.getElementById('sameAsShipping').addEventListener('sl-change', function(event) {
        const shippingInputs = {
            name: document.querySelector('sl-input[name="name"]').value,
            email: document.querySelector('sl-input[name="email"]').value,
            country: document.querySelector('sl-select[name="country"]').value,
            address: document.querySelector('sl-input[name="address"]').value,
            postalCode: document.querySelector('sl-input[name="postalCode"]').value
        };

        if (event.target.checked) {
            document.querySelector('sl-input[name="bname"]').value = shippingInputs.name;
            document.querySelector('sl-input[name="bemail"]').value = shippingInputs.email;
            document.querySelector('sl-select[name="bcountry"]').value = shippingInputs.country;
            document.querySelector('sl-input[name="baddress"]').value = shippingInputs.address;
            document.querySelector('sl-input[name="bpostalCode"]').value = shippingInputs.postalCode;
        }
    });

    const dialog = document.querySelector('.dialog-scrolling');
    const container = document.querySelector('.shipping-billing-details');
    const containerfaqs = document.querySelector('.faqs-group');

    // Close all other details when one is shown
    containerfaqs.addEventListener('sl-show', event => {
      if (event.target.localName === 'sl-details') {
        [...containerfaqs.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
      }
    });    
    
    // Show Much sad on error
    function showAlert(icon, title, html) {
        Swal.fire({
            icon: icon,
            title: title,
            background: '#000000',
            showConfirmButton: true,
            confirmButtonColor: '#580DA9',
            html: `<img src="img/sad_doge.gif" style="border-radius: 20px; max-width:100%"><br>${html}`,
            customClass: { popup: 'dogebox-swal' }                       
        });
    }
});