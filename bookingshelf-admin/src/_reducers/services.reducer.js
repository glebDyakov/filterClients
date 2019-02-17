import {clientConstants, servicesConstants} from '../_constants';

export function services(state= {}, action) {
    switch (action.type) {
        case servicesConstants.SERVICE_SUCCESS_TIME:
            setTimeout(()=>$('.new-service-modal').modal('hide'), 100)

            return {
                ...state,
                status: 209
            };
        case servicesConstants.GROUP_SUCCESS_TIME:
            setTimeout(()=>$('.modal_add_group').modal('hide'), 100)

            return {
                ...state,
                status: 209
            };
        case servicesConstants.SERVICE_REQUEST:
            return {
                ...state,
                status: 208,
                adding: true
            };
        case servicesConstants.GET_GROUP_SUCCESS:
            return {
                ...state,
                services: action.services
            };
        case servicesConstants.GET_SERVICES_SUCCESS:
            return {
                ...state,
                servicesList: action.servicesList
            };
        case servicesConstants.ADD_GROUP_SUCCESS:
            let servicesCurrent=state.services;

            servicesCurrent=="" ?servicesCurrent=[action.services]: servicesCurrent.push(action.services);

            return {
                ...state,
                status: 200,
                services: servicesCurrent,
                adding: false
            };
        case servicesConstants.ADD_GROUP_FAILURE:
            return state;
        case servicesConstants.UPDATE_GROUP_SUCCESS:
            const services=state.services;

            services.find((item, key)=>{
                if(item.serviceGroupId===action.services.serviceGroupId){
                    services[key]=action.services;
                }
            });

            return {
                ...state,
                status: 200,
                services: services,
                adding: false
            };
        case servicesConstants.UPDATE_GROUP_FAILURE:
            return state;
        case servicesConstants.DELETE_GROUP_SUCCESS:
            return {
                ...state,
                services: state.services.filter(services => services.serviceGroupId !== action.serviceId)
            };
        case servicesConstants.GET_SERVICE_LIST_SUCCESS:
            const servicesCurrentList=state.services;

            servicesCurrentList.find((group, keyGr)=>{
                if(group.serviceGroupId===action.idGroup){
                    servicesCurrentList[keyGr]['services'] = action.services;
                }
            });

            return {
                ...state,
                services: servicesCurrentList
            };
        case servicesConstants.ADD_SERVICE_SUCCESS:
            const servicesCurrentListADD=state.services;

            servicesCurrentListADD.find((group, keyGr)=>{
                if(group.serviceGroupId===action.serviceId){
                    servicesCurrentListADD[keyGr]['services'] ?
                        servicesCurrentListADD[keyGr]['services'].push(action.servicesFromGroup):
                        servicesCurrentListADD[keyGr]['services']=[action.servicesFromGroup];
                }
            });

            return {
                ...state,
                status: 200,
                services: servicesCurrentListADD,
                adding: false
            };
        case servicesConstants.ADD_SERVICE_FAILURE:
            return state;
        case servicesConstants.UPDATE_SERVICE_SUCCESS:
            const servicesGroups=state.services;

            servicesGroups.map((group, keyGr)=>{
                if(group.serviceGroupId===action.serviceId){
                    group['services'].map((item, key)=> {

                        if(item.serviceId===action.servicesFromGroup.serviceId)
                        {
                            servicesGroups[keyGr]['services'][key] = action.servicesFromGroup;
                        }

                    })
                }
            });

            return {
                ...state,
                status: 200,
                services: servicesGroups,
                adding: false
            };
        case servicesConstants.UPDATE_SERVICE_FAILURE:
            return state;
        case servicesConstants.DELETE_SERVICE_SUCCESS:

            const servicesGroupsDeleted=state.services;

            state.services.map(services => services.serviceGroupId === action.serviceGroupId ?
                services['services'].map((item, key)=>item.serviceId===action.serviceId&&services['services'].splice(key, 1)): services)

            return {
                ...state,
                services: servicesGroupsDeleted
            };
        default:
            return state
    }
}