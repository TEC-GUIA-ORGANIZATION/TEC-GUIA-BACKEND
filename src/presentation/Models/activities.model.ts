import mongoose from 'mongoose';

export enum tipoActividad {
    ORIENTADORA = 'Orientadora',
    MOTIVACIONAL = 'Motivacional',
    APOYO_VIDA_ESTUDIANTIL = 'De apoyo a la vida estudiantil',
    ORDEN_TECNICO = 'De orden tecnico',
    RECREACION = 'De recreacion'
};

export enum estadoActividad {
    PLANEADA = 'PLANEADA',
    NOTIFICADA = 'NOTIFICADA',
    REALIZADA = 'REALIZADA',
    CANCELADA = 'CANCELADA'
};

const actividadSchema = new mongoose.Schema({
    // semana: {
    //   type: Number,
    //   require: true,  
    // },
    tipoActividad:{
        type: String,
        enum: tipoActividad,
        require: true,
    }, 
    nombreActividad: {
        type: String,
        require: true,
    },
    // responsables: {
    //     type: [String],
    //     require: true,
    // },
    // diasParaAnunciar: {
    //     type: Number,
    //     require: true,
    // },
    // diasParaRecordar: {
    //     type: Number,
    //     require: true,
    // },
    // isPresencial: {
    //     type: Boolean,
    //     require: true,
    // },
    // enlaceReu: {
    //     type: String,
    //     require: false,
    // },
    // afiche: {
    //     type: Buffer,
    //     require: true,
    // },
    // estado: {
    //     type: String,
    //     enum: estadoActividad,
    //     require: true,
    // },
    // evidencias: {
    //     type: [Buffer] | String,
    //     require: false,
    // }
});

export const ActividadModel = mongoose.model('Actividades', actividadSchema);