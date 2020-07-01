import React from 'react';
import '../../../public/scss/accountantModal.scss';

const ForAccountant = () => {
    return (
        <div className='accountant-modal-wrapper'>
            <div className="modal fade accountant-modal-in show">
                <div className="modal-dialog modal-dialog-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Обоснования правомерности не оформления Актов
                                на передачу прав на использование ОИС
                            </h5>
                            <button data-dismiss="modal" className="close"></button>
                        </div>
                        <div className="modal-body">
                            <span>
                                *Имущественные права на ОИС признаются нематериальными активами (далее - НМА)
                                организации только при соблюдении определенных критериев
                                (п. 6 Инструкции по бухгалтерскому учету нематериальных активов,
                                утвержденной постановлением Министерства финансов
                                Республики Беларусь от 30.04.2012 N 25 (далее - Инструкция N 25)).
                            </span>
                            <span>
                                *Единицей бухгалтерского учета НМА является инвентарный объект - совокупность
                                имущественных прав, возникающих из патента, свидетельства,
                                лицензионного (авторского) договора либо в ином установленном
                                законодательством порядке, предназначенных для выполнения определенных
                                самостоятельных функций. Поэтому единицей учета является ни сам объект
                                (компьютерная программа, веб-сайт, любое иное произведение литературы,
                                науки и искусства и т.п.), а исключительное право на них (на РИД) с комплексом
                                имущественных прав (п. 9 Инструкции N 25).
                            </span>
                            <span>
                                *При передаче в пользование исключительного права на РИД по лицензионному
                                договору, учитываемого у лицензиара в составе НМА на счете 04
                                "Нематериальные активы", это исключительное право продолжает
                                учитываться у лицензиара и уменьшение стоимости данного объекта
                                НМА не происходит (ч. 1 п. 33 Инструкции N 25).
                            </span>
                            <span>
                                *Каждая хозяйственная операция подлежит оформлению первичным учетным
                                документом, который составляется при ее совершении, а если это не
                                представляется возможным - непосредственно после совершения
                                (п. 1, 5 ст. 10 Закона Республики Беларусь от 12.07.2013 N 57-З
                                "О бухгалтерском учете и отчетности" (далее - Закон N 57-З)).
                            </span>
                            <span>
                                *Есть утвержденный перечень первичных учетных документов,
                                обязательных к применению организациями Республики Беларусь.
                                Одним из них является акт о приеме-передаче нематериальных активов,
                                утвержденный постановлением Министерства финансов Республики Беларусь
                                от 22.04.2011 N 23 "Об установлении форм акта о приеме-передаче основных
                                средств, акта о приеме-передаче нематериальных активов и утверждении
                                Инструкции о порядке заполнения акта о приеме-передаче основных средств
                                и акта о приеме-передаче нематериальных активов" (далее - Инструкция N 23).
                            </span>
                            <span>
                                *Данный акт заполняется организацией, передающей числящиеся в бухгалтерском
                                учете объекты НМА, и (или) организацией, принимающей их к бухгалтерскому
                                учету (п. 2 Инструкции N 23).Поскольку при передаче объекта НМА по
                                лицензионному договору он не выбывает, а продолжает числиться в учете
                                лицензиара, акт о приеме-передаче НМА лицензиаром не оформляется.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForAccountant;