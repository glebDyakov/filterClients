import React, {PureComponent} from 'react';
import moment from 'moment'
import ReactPhoneInput from "react-phone-input-2";
import {isValidNumber} from "libphonenumber-js";


class TabFive extends  PureComponent {

    render() {

        const {setScreen,refreshTimetable, selectedStaff,serviceId,selectedDay,selectedServices,selectedTime,
            group,handleChange,isValidEmailAddress,setterPhone,setterEmail,handleSave} = this.props;


        return (
            <div className="service_selection screen5">
                <div className="title_block">
                            <span className="prev_block" onClick={()=>{
                                setScreen(4);
                                refreshTimetable()}}>
                                Назад</span>
                    <p className="modal_title">Запись</p>
                </div>
                <div className="specialist">
                    {selectedStaff.staffId &&
                    <div>
                        <p className="img_container">
                            <img src={selectedStaff.imageBase64?"data:image/png;base64,"+selectedStaff.imageBase64:`${process.env.CONTEXT}public/img/image.png`} alt=""/>
                            <span>{selectedStaff.firstName} {selectedStaff.lastName}</span>
                        </p>
                    </div>
                    }
                    {serviceId &&
                    <div className="supperVisDet" >
                        {(selectedServices.length===1)?<p>{selectedServices[0].name}</p>:
                            (<p>Выбрано услуг: <br/>
                                <p><strong>{selectedServices.length}</strong></p></p>)}

                    </div>
                    }
                    {selectedDay &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedDay).locale('ru').format('DD MMMM YYYY')}</strong>
                    </div>
                    }
                    {selectedTime &&
                    <div className="date_item_popup">
                        <strong>{moment(selectedTime, 'x').format('HH:mm')}</strong>
                    </div>
                    }
                </div>
                <p>Имя</p>
                <input type="text" placeholder="Введите имя" name="clientName" onChange={handleChange}
                       value={group.clientName && group.clientName}
                       className={((group.phone && !group.clientName) ? ' redBorder' : '')}
                />
                <p>Телефон</p>
                <div className="phones_country">
                    <ReactPhoneInput
                        regions={['america', 'europe']}
                        disableAreaCodes={true}

                        inputClass={((!group.phone && group.email && group.email!=='' && !isValidNumber(group.phone)) ? ' redBorder' : '')} value={ group.phone }  defaultCountry={'by'} onChange={phone => setterPhone(phone)}
                    />

                </div>
                <br/>
                <p>Email</p>
                <input type="text" placeholder="Введите email" name="email" onChange={handleChange}
                       onKeyUp={() => setterEmail()}
                       value={group.email}
                       className={'' + ((group.email && group.email!=='' && !isValidEmailAddress(group.email)) ? ' redBorder' : '')}
                />
                <p>Комментарии</p>
                <textarea placeholder="Комментарии к записи"  name="description" onChange={handleChange} value={group.description}/>
                <p className="term">Нажимая кнопку &laquo;записаться&raquo;, вы соглашаетесь с <a href="#">условиями
                    пользовательского соглашения</a></p>
                <input className={((!selectedStaff.staffId || !serviceId || !selectedDay || !group.phone || !isValidNumber(group.phone) || !selectedTime || !group.clientName) ? 'disabledField': '')+" book_button"} type="submit" value="ЗАПИСАТЬСЯ" onClick={
                    ()=>(selectedStaff.staffId && serviceId && selectedDay && group.phone && isValidNumber(group.phone) && selectedTime && group.clientName) && handleSave()}/>
            </div>
        );
    }
}
export default TabFive;