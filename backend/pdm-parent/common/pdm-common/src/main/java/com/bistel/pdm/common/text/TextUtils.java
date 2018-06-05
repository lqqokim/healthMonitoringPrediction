package com.bistel.pdm.common.text;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.csv.*;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

/**
 * Text and parsing related utility methods.
 */
public final class TextUtils {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final CSVFormat CSV_FORMAT = CSVFormat.RFC4180.withSkipHeaderRecord().withEscape('\\');

    private static final String[] EMPTY_STRING = {""};

    private static final Pattern TWO_DOUBLE_QUOTE_ESC = Pattern.compile("\"\"", Pattern.LITERAL);
    private static final String SLASH_QUOTE_ESC = Matcher.quoteReplacement("\\\"");

    private TextUtils() {
    }

    public static String[] parseDelimited(String delimited, char delimiter) {
        return doParseDelimited(delimited, formatForDelimiter(delimiter));
    }

    public static String[] parsePMMLDelimited(String delimited) {
        // Although you'd think ignoreSurroundingSpaces helps here, won't work with space
        // delimiter. So manually trim below.
        String[] rawResult = doParseDelimited(delimited, formatForDelimiter(' '));
        List<String> resultList = new ArrayList<>();
        for (String raw : rawResult) {
            if (!raw.isEmpty()) {
                resultList.add(raw);
            }
        }
        return resultList.toArray(new String[resultList.size()]);
    }

    private static String[] doParseDelimited(String delimited, CSVFormat format) {
        try (CSVParser parser = CSVParser.parse(delimited, format)) {
            Iterator<CSVRecord> records = parser.iterator();
            return records.hasNext() ?
                    StreamSupport.stream(records.next().spliterator(), false).toArray(String[]::new) :
                    EMPTY_STRING;
        } catch (IOException e) {
            throw new IllegalStateException(e); // Can't happen
        }
    }

    public static String joinDelimited(Iterable<?> elements, char delimiter) {
        return doJoinDelimited(elements, formatForDelimiter(delimiter));
    }

    public static String joinPMMLDelimited(Iterable<?> elements) {
        String rawResult = doJoinDelimited(elements, formatForDelimiter(' '));
        // Must change "" into \"
        return TWO_DOUBLE_QUOTE_ESC.matcher(rawResult).replaceAll(SLASH_QUOTE_ESC);
    }

    public static String joinPMMLDelimitedNumbers(Iterable<? extends Number> elements) {
        // bit of a workaround because NON_NUMERIC quote mode still quote "-1"!
        CSVFormat format = formatForDelimiter(' ').withQuoteMode(QuoteMode.NONE);
        // No quoting, no need to convert quoting
        return doJoinDelimited(elements, format);
    }

    private static CSVFormat formatForDelimiter(char delimiter) {
        CSVFormat format = CSV_FORMAT;
        if (delimiter != format.getDelimiter()) {
            format = format.withDelimiter(delimiter);
        }
        return format;
    }

    private static String doJoinDelimited(Iterable<?> elements, CSVFormat format) {
        StringWriter out = new StringWriter();
        try (CSVPrinter printer = new CSVPrinter(out, format)) {
            for (Object element : elements) {
                printer.print(element);
            }
            printer.flush();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
        return out.toString();
    }

    /// JSON --

    public static String[] parseJSONArray(String json) throws IOException {
        return MAPPER.readValue(json, String[].class);
    }

    public static String joinJSON(Iterable<?> elements) {
        try {
            return MAPPER.writeValueAsString(elements);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException(e);
        }
    }

    public static <T> T readJSON(String json, Class<T> clazz) {
        try {
            return MAPPER.readValue(json, clazz);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    public static <T> T convertViaJSON(Object value, Class<T> clazz) {
        return MAPPER.convertValue(value, clazz);
    }
}
