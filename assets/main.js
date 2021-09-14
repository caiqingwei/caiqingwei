$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '619px' });

  client.get('ticket.requester').then(
    function(data) {
      var requester = data['ticket.requester'];
      email = requester['email'];
      orderList(client, email);
    }
  );

});





// 根据用户提供的邮箱去获得单号列表
function orderList(client, email) {
  if (email === '' || email === 'customer@example.com') {
    showError('Could not find order');
    return;
  }
  var url = 'https://api.parcelpanel.com/***************';
  var settings = {
    url: url, 
    type:'POST',
    secure: true,
    dataType: 'json',
     data: JSON.stringify({"email":email, "pp-key":"{{setting.pp-key}}" }),
      //data: JSON.stringify({"email":email, "pp-key":key }),
    headers: {"Content-Type": "application/json"}
  };

  client.request(settings).then(
    function(data) {
      showOrderList(data);
    },
    function(response) {
      showError(response.message);
    }
  );

}

// 显示订单列表出来
function showOrderList(data) {
  if(data.code === 201 || data.code == null){
    showError('Could not find order');
    return;
  }

  var requester_data = {
     order_list:data.data
  };

  var source = $("#order-list-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
}

// 展示为空时候的信息，并切换模板
function orderDetail(track_number_id) {
  // 数据已经挂载到了DOM上面，就不用管了
  if($('#t' + track_number_id).text() === 'Copy')
  {
    return;
  }
  var client = ZAFClient.init();

  var url = 'https://api.parcelpanel.com/***************';
  var settings = {
    url: url, 
    type:'POST',
    secure: true,
    dataType: 'json',
    data: JSON.stringify({"track_number":track_number, "pp-key":"{{setting.pp-key}}"}),
     //data: JSON.stringify({"email":email,"component_id":track_number_id, "pp-key":key }),
     headers: {"Content-Type": "application/json"}

  };
  client.request(settings).then(
    function(response) {


      var events = response.data;
      var copied_data=[];

      $.each(events, function(i, item){
        if(i==='items'||i==='track_number_id'){ return true;}
        var  obj= [{ title : i,text :item }];
        copied_data.push.apply(copied_data,obj);
      });
      copied_data.push(events.items);


      var html = '<button type="button" id="tb'+ response.data.track_number_id +'" data-clipboard-text="'+ copiedDetail(copied_data) +'" ' +
        'class="btn btn-outline-secondary copy">Copy</button>\n';
      for (var i =0;i < 6; i++){
        html+='<div class="mt"><span class="order-detail-column">'+copied_data[i].title+': </span> <span' +
          ' class="order-detail-value">'+copied_data[i].text+'</span></div>\n';
      }



      // 对events需要单独的赋值上去
      var events = response.data.items;
      if(events.length != 0){
        html+='<div class="mt"><span class="order-detail-column">Tracking detailed info：</span></div>'
      }

      // 清空loading效果 并赋值
      $('#t' + response.data.track_number_id).html('');
      $('#t' + response.data.track_number_id).append(html)


      // // 对节点进行赋值的操作
      // $('#t' + response.data.track_number_id + ' div:eq(0) span:eq(1)').html(copied_data[].text)
      // $('#t' + response.data.track_number_id + ' div:eq(1) span:eq(1)').html(copied_data[1].text)
      // $('#t' + response.data.track_number_id + ' div:eq(2) span:eq(1)').html(copied_data[2].text)
      //  $('#t' + response.data.track_number_id + ' div:eq(3) span:eq(1)').html("--------------------")
      // $('#t' + response.data.track_number_id + ' div:eq(4) span:eq(1)').html(copied_data[4].text)
      // $('#t' + response.data.track_number_id + ' div:eq(5) span:eq(1)').html(copied_data[5].text)



      var html = '';


      for (var i =0;i < events.length; i++){
          html +='\n'+'<div>' +
              // '<p class="events-detail"></p>\n' +
               '<p class="events-time">' +events[i].title+ '</p>  ' +
              '</div>';
      }

      // $('#t' + response.data.track_number_id + ' div:eq(3) span:eq(1)').html(delievered_time)
      $('#t' + response.data.track_number_id).append(html)

    },
    function(response) {
      showError(response.message);
    }
  );

}


// 展示错误信息，并切换模板
function showError(message) {
  var error_data = {
    'message': message
  };
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}

// 需要复制的单号信息
function copiedDetail(copied_data)
{
      var text = '';
      for (var i =0;i < 6; i++){
        text +=copied_data[i].title+': '+copied_data[i].text +'\n';
      }
      if(copied_data[6].length!=0){
        text +='Tracking detailed info: \n';
        copied_data[6].forEach((element,key) =>  text +=element.title+';\n');
      }


    return text;
}
