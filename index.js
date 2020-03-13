
//import './env';
var TelegramBot = require('node-telegram-bot-api') ;
var token = '1121672090:AAGMvpYu-FSyeRuzGCQOY0xgGiR6K6E12Gs';
const bot = new TelegramBot(token, { polling: true });
var request = require('request');
//Keyboards
const StartKeyboard = [
  ['Result', 'Current Performance'],
  ['Schedule']
]

const Backeyboard = [
    ['Main Menu', 'Cancel']
  ]
//Main Script
bot.onText(/\/start/, (msg) => {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: StartKeyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    })
  };
  bot.sendMessage(msg.chat.id, "Hi "+ msg.from.first_name+". welcome to uniSchool bot, what will you like to ask today?", opts);
});

//main menu
bot.onText(/Main Menu/, (msg) => {
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: StartKeyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      })
    };
    bot.sendMessage(msg.chat.id, "Hi "+ msg.from.first_name+". welcome to uniSchool bot, what will you like to ask today?", opts);
  });

//cancel
bot.onText(/Cancel/, (msg) => {
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: StartKeyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      })
    };
    bot.sendMessage(msg.chat.id, "Alright "+ msg.from.first_name+". doing the right away", opts);
  });

//result
bot.onText(/Result/, (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: Backeyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        })
      };

  bot.sendMessage(msg.chat.id, `Please enter Your ID:`,opts);
  getmessage1();
});

//performance
bot.onText(/Current Performance/, (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: Backeyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        })
      };

  bot.sendMessage(msg.chat.id, `Please enter Your ID:`,opts);
  getmessage2();
});

//schedule
bot.onText(/Schedule/, (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: Backeyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        })
      };

  bot.sendMessage(msg.chat.id, `Please enter Your User-Name:`,opts);
  getmessage3();
});


// Function1
var getmessageResult = async () => {
  await new Promise((resolve, reject) => {
    bot.once('message', (msg) => {
      console.log("User Message Is: " + msg.text)
      const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
          keyboard: Backeyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        })
      };
      var resp = msg.text;
      request(`http://172.16.0.16:8080/uni-schoolManagement/rest/ResultDataResource/getStudentResultBySchoolId?SchoolId=${resp}`,function(error,response,body){
      //       console.error('error:', error);
      //       console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body);
         if(!error && response.statusCode ===200){
          var res = JSON.parse(body);
          if(res.count !==0 ){
            for (var i=0; i<res.items.length; i++){
                           
             bot.sendMessage(msg.chat.id,'Performance-Result:- \n Grade:                '+res.items[i].courses.grade.grade +'\n Course-Name:   '+ res.items[i].courses.course+'\n Result-Type:      '+res.items[i].resultType.name+ '\n Result:               '+res.items[i].result+'\n Percent-from:    '+res.items[i].percent +' %',opts);
         // bot.sendMessage(msg.chat.id,body,opts);
            }
          }
          else
          bot.sendMessage(msg.chat.id,'Sorry '+ msg.from.first_name+ '. wrong or invalid ID please choose the option bellow and retry again.',opts);
        
         }
      })
     // bot.sendMessage(msg.chat.id, 'Thanks, Your Message Received', opts);
      resolve(true);
    });
  });
  return
}


// Function2
var getmessagePerformance = async () => {
    await new Promise((resolve, reject) => {
      bot.once('message', (msg) => {
        console.log("User Message Is: " + msg.text)
        const opts = {
          reply_to_message_id: msg.message_id,
          reply_markup: JSON.stringify({
            keyboard: Backeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
          })
        };
        var resp = msg.text;
        request(` http://172.16.0.16:8080/uni-schoolManagement/rest/ResultDataResource/getStudentPerformance?studentID=${resp}`,function(error,response,body){
           if(!error && response.statusCode ===200){
            var res = JSON.parse(body);
            if(res.baseResponse.responseStatus.status===true ){
     bot.sendMessage(msg.chat.id,'Result: \n StudentID:  '+res.data.studentSectionID+'\n Average:     '+res.data.average +'\n Rank:          '+res.data.rank +'\n Conduct:    '+res.data.conduct,opts ) ; 
     // bot.sendMessage(msg.chat.id,body,opts);
            }
            else
            bot.sendMessage(msg.chat.id,'Sorry '+ msg.from.first_name+ '. wrong or invalid ID please choose the option bellow and retry again.',opts);
           }
        })
       // bot.sendMessage(msg.chat.id, 'Thanks, Your Message Received', opts);
        resolve(true);
      });
    });
    return
  }

  // Function3
var getmessageSchedule = async () => {
    await new Promise((resolve, reject) => {
      bot.once('message', (msg) => {
        console.log("User Message Is: " + msg.text)
        const opts = {
          reply_to_message_id: msg.message_id,
          reply_markup: JSON.stringify({
            keyboard: Backeyboard,
            resize_keyboard: true,
            one_time_keyboard: true
          })
        };
        var resp = msg.text;
        request(`http://172.16.0.16:8080/uni-schoolManagement/rest/TeacherResource/getTeacherScheduleByUserName?userName=${resp}`,function(error,response,body){
           if(!error && response.statusCode ===200){
             var res = JSON.parse(body)
             if (res.classDTO!==null){
               if(res.classDTO.length!==0){
             for(var i = 0; i< res.classDTO.length; i++){
             var period = parseInt(res.classDTO[i].timeSlot.id, 10)-8;
              bot.sendMessage(msg.chat.id,'Your shchedul list for today:\n weekDay:   '+ res.weekDay+ '\n grade:         '+ res.classDTO[i].sectiion.grade.grade+'\n section       '+res.classDTO[i].sectiion.section+'\n course:       '+res.classDTO[i].courses.course+'\n period:        '+period,opts);
             }
            }
            else
            bot.sendMessage(msg.chat.id, 'you have No class today');
            }
            else
            bot.sendMessage(msg.chat.id, 'wrong or invalid user name please choose the option bellow and retry again.',opts);
           }
        })
       // bot.sendMessage(msg.chat.id, 'Thanks, Your Message Received', opts);
        resolve(true);
      });
    });
    return
  }

var getmessage1 = async () => {
  await getmessageResult();
}

var getmessage2 = async () => {
    await getmessagePerformance();
  }

  var getmessage3 = async () => {
    await getmessageSchedule();
  }
  