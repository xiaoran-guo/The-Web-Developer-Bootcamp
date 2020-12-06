$(document).ready(function () {
    $('#signup-btn').on('click', function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        // Check if all mandatory fields are filled out
        if (!username || !password) {
            alert("username and password can't be empty!");
            return ;
        }

        // Check if password is strong enough
        if (password.length < 5
            || !(/[a-z]/.test(password))
            || !(/[A-Z]/.test(password))
            || !(/[0-9]/.test(password))
        ) {
            alert("password not strong enough");
            return ;
        }

        $.ajax({
            url: "/register/checkUsernameBeenUsed",
            type: "POST",
            dataType: "json",
            data: {
                username: username
            },
            success: function (data) {
                // Check the new username if it’s already registered to the system
                if (!data.valid) {
                    alert("username already used!");
                    return ;
                }
                $("#form").submit();
            },
            error: function () {
                alert("can't check with server");
            }
        });
    })
});

