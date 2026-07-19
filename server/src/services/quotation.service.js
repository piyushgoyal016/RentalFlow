import * as quotationRepository from "../repositories/quotation.repository.js";
import ApiError from "../utils/ApiError.js";

export const getAllTemplates = async () => {
  return await quotationRepository.findAll();
};

export const getTemplateById = async (id) => {
  const template = await quotationRepository.findById(id);
  if (!template) throw new ApiError(404, "Quotation template not found");
  return template;
};

export const createTemplate = async (data) => {
  return await quotationRepository.create(data);
};

export const updateTemplate = async (id, data) => {
  const template = await quotationRepository.findById(id);
  if (!template) throw new ApiError(404, "Quotation template not found");
  return await quotationRepository.update(id, data);
};

export const deleteTemplate = async (id) => {
  const template = await quotationRepository.findById(id);
  if (!template) throw new ApiError(404, "Quotation template not found");
  return await quotationRepository.remove(id);
};
