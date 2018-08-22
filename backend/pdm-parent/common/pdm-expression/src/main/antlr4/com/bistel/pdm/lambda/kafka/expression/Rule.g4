grammar Rule;

primaryExpression
    :   DECIMAL_CONSTANT
    |   DOUBLE_CONSTANT
    |   BOOLEAN_CONSTANT
    |   DATE_CONSTANT
    |   IDENTIFIER
    |   STRING_LITERAL
    |   '(' expression ')'
    ;

notExpression
    :   primaryExpression
    |   'NOT' notExpression
    ;

relationalExpression
    :   notExpression
    |   relationalExpression '<' notExpression
    |   relationalExpression '>' notExpression
    |   relationalExpression '<=' notExpression
    |   relationalExpression '>=' notExpression
    ;

equalityExpression
    :   relationalExpression
    |   equalityExpression '==' relationalExpression
    |   equalityExpression '!=' relationalExpression
    ;

logicalAndExpression
    :   equalityExpression
    |   logicalAndExpression 'AND' equalityExpression
    ;

logicalOrExpression
    :   logicalAndExpression
    |   logicalOrExpression 'OR' logicalAndExpression
    ;

expression
    :   logicalOrExpression
    ;

BOOLEAN_CONSTANT
    :   'TRUE'
    |   'FALSE'
    ;

DATE_CONSTANT
    :   DIGIT+ '-' DIGIT+ '-' DIGIT+
    ;

IDENTIFIER
    :   NON_DIGIT
        (   NON_DIGIT
        |   DIGIT
        )*
    ;

fragment
NON_DIGIT
    :   [a-zA-Z]
    ;

DECIMAL_CONSTANT
    :   DIGIT+
    ;

PT  :   '.'
    ;

DOUBLE_CONSTANT
    :   DIGIT+ PT DIGIT+
    |   PT DIGIT+
    |   DIGIT+
    ;

fragment
DIGIT
    :   [0-9]
    ;

fragment
ESCAPE_SEQUENCE
    :   '\\' ['"?abfnrtv\\]
    ;

STRING_LITERAL
    :   '"' CHAR_SEQUENCE? '"'
    ;

fragment
CHAR_SEQUENCE
    :   CHAR+
    ;

fragment
CHAR
    :   ~["\\\r\n]
    |   ESCAPE_SEQUENCE
    |   '\\\n'
    |   '\\\r\n'
    ;

WHITESPACE
    :   [ \t]+
        -> skip
    ;

NEWLINE
    :   (   '\r' '\n'?
        |   '\n'
        )
        -> skip
    ;

BLOCK_COMMENT
    :   '/*' .*? '*/'
        -> skip
    ;

LINE_COMMENT
    :   '//' ~[\r\n]*
        -> skip
    ;