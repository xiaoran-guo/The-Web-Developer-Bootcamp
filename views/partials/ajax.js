
$(function () {

    var page = 5;
    var pageLimit = 4;     
    var totalrecord = 0;    //totalrecord is the # of campgrounds
    fetchData();
    //handling the prev-btn
    $(".pre-btn").on("click", function () {
        if (page > 1 ) {
            page--;
            fetchData();
        }
        console.log("Prev Page: " + page);
    });

    //handling the next-btn
    $(".next-btn").on("click", function () {
        if (page * pageLimit < totalrecord) {
            page++;
            fetchData();
        }
        console.log("Next Page: " + page);
    });
    

   function fetchData() {
        //ajax() method to make api calls
        $.ajax({
            url: './image/generated.json',
            type: 'GET',
            data: {
                "page": page,
                "pagelimit": pageLimit
            },
            success: function (data) {
                console.log(data);
                if (data.success) {
                    var dataArr = data.success.data;
                    totalrecord = data.success.totalrecord;
                    var html = "";
                    for (var i = 0; i < dataArr.length; i++) {
                        html += "<div class='sample-data'>" +
                            "<h3>" + dataArr[i].balance + "</h3>"+
                        "</div>";
                    }
                    $("#result").html(html);
                }
            },
            error: function (jqXHR, textStatus, errorTrhown) {
                console.error(jqXHR);
                console.error(textStatus);
                console.error(errorTrhown);
            },
        });
   }
});
