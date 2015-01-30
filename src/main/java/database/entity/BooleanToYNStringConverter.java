package database.entity;

import javax.persistence.AttributeConverter;


public class BooleanToYNStringConverter implements AttributeConverter<Boolean, String> {

	public String convertToDatabaseColumn(Boolean attribute) {
		if (attribute == null) {
            return null;
        }
        if (attribute.booleanValue()) {
            return "Y";
        }
        return "N";
	}

	public Boolean convertToEntityAttribute(String dbData) {
		// TODO Auto-generated method stub
		if (dbData == null) {
            return null;
        }
        if (dbData.equals("Y") || dbData.equals("y")) {
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
	}

  

}